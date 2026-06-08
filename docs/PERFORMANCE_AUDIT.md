# Frontend Performance Audit — Sassy Strides

**Date:** June 2026  
**Scope:** React SPA (Vite) + WordPress Sassy API + Advanced Ads

---

## Executive Summary

The site used correct patterns (React Query, lazy routes) but suffered from **duplicate network calls**, **ad query fan-out**, **oversized image URLs**, and **blocking homepage render**. Optimizations below target sub-1s perceived load for list pages and sub-1.5s for article detail.

---

## Current API Calls (Before)

| Trigger | Endpoint | Count (typical homepage visit) |
|---------|----------|--------------------------------|
| `usePosts` | `GET /sassy/v1/homepage` | 1 |
| `BannersProvider` | `GET /sassy/v1/banners` | 1 (duplicate) |
| `AdSlot` × ~15 | `GET /sassy/v1/banners` (via service dedup) | 1 in-flight, 15 React Query observers |
| `validateAllConfiguredAds` | All 24 ad IDs | 24 parallel lookups (prod) |
| `BannersContext` + `advancedAdsService` | Same `/banners` payload | 2× fetch |
| Category nav hover | `GET /sassy/v1/category/{slug}` | 0–5 (prefetch) |
| Blog detail | `GET /sassy/v1/post/{slug}` | 1 |
| Related posts | `GET /sassy/v1/category/{slug}` | 1 (often duplicate of cached category) |
| Featured category ads | `GET /wp/v2/media?parent={id}` × 7 | 7 |

**Homepage total network:** ~3–4 unique endpoints, but **2× `/banners`** and **24 validation fetches in production**.

**Payload issues:**
- No `_fields` filtering (custom Sassy API returns full card objects; acceptable if backend omits `content` on list endpoints).
- Card images used full-resolution URLs when `medium_large` was available.

---

## Optimized API Calls (After)

| Trigger | Endpoint | Count |
|---------|----------|-------|
| `usePosts` | `GET /sassy/v1/homepage` | 1 |
| `prefetchHomepageAds` | `GET /sassy/v1/banners` + hydrate React Query | 1 (shared with `BannersProvider`) |
| `BannersProvider` | Uses `loadHomepageBanners()` shared promise | 0 additional |
| `AdSlot` × ~15 | Reads hydrated `['advanced-ad', id]` cache | 0 additional network |
| `validateAllConfiguredAds` | Dev only | 0 in production |
| Related posts | Reuses `categoryPosts` React Query cache | 0 when navigated from category |
| Blog card hover | Prefetch `GET /sassy/v1/post/{slug}` | 0–1 on intent |
| Category featured ads | `prefetchCategoryAds` bulk hydrate | 7 media calls, 1 batch timing |

**Homepage total network:** **2 requests** (`/homepage` + `/banners`) on cold load.

---

## Changes Implemented

### 1. Centralized API layer
- **`src/services/api.js`** — single export surface for posts, ads, and query helpers.

### 2. Ad deduplication & caching
- **`loadHomepageBanners()`** exported; `bannerService` and `advancedAdsService` share one in-flight promise.
- **`adQueries.js`** — `prefetchHomepageAds` / `prefetchCategoryAds` hydrate all `['advanced-ad', id]` React Query entries from memory cache.
- **`useAd` hook** — all `AdSlot` instances share query keys (deduped observers).

### 3. Blog fetching
- List pages use Sassy `/homepage` and `/category/{slug}` (no full `content` on cards).
- Article pages use `/post/{slug}` only on detail route.
- Related posts read from existing `categoryPosts` cache when available.

### 4. Image optimization
- **`PostImage`** component — consistent `loading`, `fetchPriority`, `decoding`.
- **`normalizeSassyCard`** prefers `medium_large` → `medium` for cards; hero uses `large`/`hero`.
- Hero: `priority` + `fetchPriority="high"`; below-fold: lazy.

### 5. React optimization
- **`React.memo`** on `BlogCard`, `HeroSection`.
- **`useCallback`** for prefetch handlers on cards.
- Homepage **skeleton** renders layout immediately; content fills progressively.

### 6. Route optimization
- Category, blog, content pages remain **lazy-loaded** (`React.lazy`).
- Improved **route skeleton** fallback in `App.jsx`.

### 7. Prefetching
- **Navbar** — category data on hover/focus (existing).
- **BlogCard** — article data on hover/focus.
- **Home** — homepage ads prefetched on mount.

### 8. Production noise reduction
- Ad validation, verbose API logging, and timing logs gated to **`import.meta.env.DEV`**.

---

## Expected Performance Gains

| Metric | Before (est.) | After (est.) |
|--------|---------------|--------------|
| Homepage network requests | 4–28 | 2 |
| Duplicate `/banners` | 2 | 0 |
| Ad slot network fan-out | 15 observers, 1 fetch | 15 observers, 0 fetch after prefetch |
| Related posts duplicate category fetch | ~100% from article | ~0% when cache warm |
| Homepage TTFB → paint | Blocked until posts | Skeleton immediate |
| Card image payload | Full size | medium_large (~60–70% smaller) |
| Blog detail repeat visit | refetchOnMount always | Served from 10m stale cache |

---

## Targets vs. Recommendations

| Target | Status | Notes |
|--------|--------|-------|
| Homepage < 1s | Improved | Skeleton + 2 requests; measure with Lighthouse |
| Category < 1s | Improved | Nav prefetch + cached queries |
| Blog list < 1s | N/A | Uses homepage/category endpoints |
| Blog detail < 1.5s | Improved | Prefetch on hover + cache reuse |

### Backend recommendations (future)
1. Add `?_fields=` or dedicated lightweight DTOs on Sassy API for list cards.
2. Add `/sassy/v1/related?category=&exclude=&limit=3` to avoid full category payloads.
3. Return `image.medium_large` explicitly in all card responses.
4. Enable CDN cache headers on `/banners` and `/homepage` (frontend currently uses `cache: 'no-store'` on ad fetches only).

### Frontend follow-ups (optional)
1. Consolidate `BannersContext` + `AdSlot` into one ads provider.
2. Remove unused `FeaturedPageAds`, `useAdInView`, duplicate banner config files.
3. Add `placeholderData` from skeleton posts for instant hero render.
4. Service worker or HTTP cache for static assets.

---

## Verification Checklist

- [ ] Open DevTools → Network → reload homepage: expect `/homepage` + `/banners` only.
- [ ] Confirm no `/banners` duplicate on homepage.
- [ ] Hover blog card → see prefetched `/post/{slug}` in network.
- [ ] Navigate category → article: related posts should not re-fetch category if cache warm.
- [ ] Production build: no `validateAllConfiguredAds` network activity.
- [ ] Lighthouse mobile score on homepage and category pages.
