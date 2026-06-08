# WordPress Request Count Report

Production fix for HTTP 429: browser traffic now routes through Vercel serverless proxies (`/api/*`) with 1-hour caching and exponential retry on 429.

## Endpoints audited

The frontend does **not** call `wp-json/wp/v2/posts` or `wp-json/wp/v2/categories`. Posts use the custom Sassy API. Ads use Advanced Ads + media endpoints.

| Endpoint pattern | Used by | Production route |
|---|---|---|
| `sassy/v1/homepage` | Homepage posts | `GET /api/posts` |
| `sassy/v1/category/{slug}` | Category posts | `GET /api/posts?category={slug}` |
| `sassy/v1/post/{slug}` | Article detail | `GET /api/post/{slug}` |
| `sassy/v1/banners` | Homepage ads | `GET /api/ads?scope=homepage` |
| `wp/v2/advanced_ads` | Category ads (batch) | `GET /api/ads?scope=category` |
| `wp/v2/media?parent=` | Category ad images | Batched server-side in `/api/ads` |

### Frontend call sites

**Posts**
- `src/services/wordpressApi.js` — `getSassyHomepage`, `getSassyCategoryPosts`, `getSassyPostBySlug`
- `src/services/categoryQueries.js` — React Query wrappers
- `src/hooks/usePosts.js` — homepage `useQuery`
- `src/pages/CategoryPage.jsx` — category `useQuery`
- `src/pages/BlogDetails.jsx` — article + related posts `useQuery`
- `src/main.jsx` — homepage posts prefetch

**Ads**
- `src/services/advancedAdsService.js` — `loadCategoryAdsBatch`, `loadHomepageBanners`, `fetchAdById`
- `src/services/adQueries.js` — React Query hydration / prefetch
- `src/services/bannerService.js` — `BannersProvider` banner list
- `src/hooks/useAd.js` → `AdSlot` on homepage and category pages
- `src/context/BannersContext.jsx` — legacy banner context (shares `loadHomepageBanners` promise)

## Duplicate fetches removed

| Issue | Fix |
|---|---|
| `CategoryPage` `useLayoutEffect` re-prefetched posts already fetched by `useQuery` | Removed posts prefetch; kept ads prefetch only |
| `loadCategoryAdsBatch` reset `categoryAdsBatchPromise = null` before guard | Removed erroneous reset — batch promise now dedupes correctly |
| `prefetchAdsForPage` called `fetchAdById` per homepage slot after batch load | Removed redundant per-ID fetches |
| `React.StrictMode` double-mounting effects in dev | Removed StrictMode wrapper |
| React Query dedupes `main.jsx` prefetch + `usePosts` | Same `queryKey` — single network call |

## Caching layers

1. **Vercel API** (`api/_lib/cache.js`) — 1-hour in-memory cache + `Cache-Control: public, s-maxage=3600`
2. **Client** (`src/services/apiClient.js`) — 1-hour in-memory cache per URL key
3. **React Query** — existing stale/gc times for posts and ads
4. **advancedAdsService** — in-memory ad cache (5 min homepage / 1 hr category)

## Retry on 429

- Server: `api/_lib/fetchWordPress.js` — exponential backoff (1s, 2s, 4s, max 8s), up to 3 retries
- Client: `src/services/apiClient.js` `fetchWithRetry` — same backoff strategy

## Request logging

Per page load, the browser console shows:

```
[api-request] { page, label, url, count }
[api-request-summary] { page, total, requests: [{ label, count }] }
```

Set in `src/utils/requestTracker.js`, triggered from `src/App.jsx` on route change.

---

## WordPress requests per page (production, cache miss)

Counts are **browser → Vercel proxy** requests. WordPress is only contacted server-side inside `/api/*`.

### Homepage (`/`)

| # | Browser request | Server WP calls (cache miss) |
|---|---|---|
| 1 | `GET /api/posts` | 1× `sassy/v1/homepage` |
| 1 | `GET /api/ads?scope=homepage` | 1× `sassy/v1/banners` |

**Browser total: 2** (deduped across `main.jsx` prefetch, `usePosts`, `BannersProvider`, `prefetchHomepageAds`)

**Server WP total: 2**

### Category page (`/fashion`, etc.)

| # | Browser request | Server WP calls (cache miss) |
|---|---|---|
| 1 | `GET /api/posts?category={slug}` | 1× `sassy/v1/category/{slug}` |
| 1 | `GET /api/ads?scope=category` | 1× `advanced_ads?include=…` + 7× `media?parent=` |

**Browser total: 2**

**Server WP total: 9** (batched and cached 1 hour — subsequent loads: 0 WP calls until cache expires)

### Article page (`/blog/{slug}`)

| # | Browser request | Server WP calls (cache miss) |
|---|---|---|
| 1 | `GET /api/post/{slug}` | 1× `sassy/v1/post/{slug}` |
| 0–1 | `GET /api/posts?category={slug}` | Only if related posts cache miss |

**Browser total: 1–2**

**Server WP total: 1–2**

---

## Before vs after (category page, worst case)

| Metric | Before | After |
|---|---|---|
| Browser → WordPress | 1 posts + 1 advanced_ads + 7 media = **9 direct** | **2** via `/api/*` |
| Duplicate post fetch | Yes (`useQuery` + `useLayoutEffect`) | No |
| Category ads batch deduped | Broken (promise reset) | Fixed |
| 429 retry | None | Exponential backoff |
| Response cache | Client only | Client + Vercel (1 hr) |

## Dev vs production

- **Development** (`npm run dev`): Vite proxies `/wp-json/*` → WordPress (unchanged workflow)
- **Production** (Vercel): Browser uses `/api/posts`, `/api/post/[slug]`, `/api/ads` only
