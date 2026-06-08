# Homepage Performance Audit — Sassy Strides

**Date:** June 8, 2026  
**Measured against:** `https://sassystrides.com` (live WordPress)  
**Target:** Homepage load < 2 seconds

---

## Executive Summary

The ~8 second homepage load is **not primarily a React/bundle problem**. Live measurements show:

| Bottleneck | Time | Share of load |
|------------|------|---------------|
| WordPress `/homepage` API | **2.74s** | ~34% |
| WordPress `/banners` API | **2.88s** | ~36% |
| Image downloads (8 unique posts) | **1.5–3.1s each** | ~25% |
| JS bundle parse (298 KB) | ~0.3–0.5s | ~5% |

**Root cause:** Slow WordPress TTFB (~2.7s per API call) + ads/banners on the critical path + 50+ image elements loading from a slow origin.

---

## 1. Network Requests (Homepage — Before Fix)

| # | Request | Size | Time | Notes |
|---|---------|------|------|-------|
| 1 | `GET /wp-json/sassy/v1/homepage` | 13.4 KB | **2.74s** | Blocks content render |
| 2 | `GET /wp-json/sassy/v1/banners` | 5.3 KB | **2.88s** | BannersProvider (app-wide) |
| 3 | `prefetchHomepageAds` | — | +2.88s | Duplicate `/banners` on critical path |
| 4 | Logo PNG | 83 KB | 0.33s | Navbar |
| 5–20 | Post images (8 unique URLs) | 70–340 KB each | **1.5–3.1s each** | Reused across 50+ `<img>` tags |
| 21+ | Google Fonts CSS + WOFF2 | ~50 KB | 0.2–0.8s | Render-blocking |

**Total API requests (cold):** 2–3 (homepage + banners, sometimes duplicated)  
**Total transferred (est.):** ~3.5–4.5 MB (images dominate)  
**Duplicate requests identified:**
- `/banners` fetched by `BannersProvider` AND `prefetchHomepageAds` (same payload)
- Same 8 post image URLs requested across Hero, CategoryGrid, MoodCarousel, 5× category sections, Editor's Picks, Fashion Cities, Instagram (browser cache dedupes after first fetch, but first load fires many parallel connections)

---

## 2. Slowest Requests (Live curl, June 2026)

| Rank | URL | Time | Size |
|------|-----|------|------|
| 1 | `/sassy/v1/banners` | 2.88s | 5.3 KB |
| 2 | `/sassy/v1/homepage` | 2.74s | 13.4 KB |
| 3 | `photo-1573497019940…768x1152.avif` | 2.95s | 340 KB |
| 4 | `photo-1541099649105…768x1152.avif` | 2.78s | 333 KB |
| 5 | `photo-1573496359142…768x1152.avif` | 2.85s | 241 KB |

> A 13 KB JSON response taking 2.7s indicates **server-side latency** (WordPress/PHP/hosting), not payload size.

---

## 3. Duplicate Requests

| Pattern | Impact |
|---------|--------|
| `BannersProvider` + `prefetchHomepageAds` | 2× `/banners` on homepage |
| `hydrateAdCache` called `fetchAdById` × 17 | 17 redundant cache lookups after banners already loaded |
| 8 posts rendered in 12+ sections | 50+ `<img>` tags, 8 unique URLs (parallel connection storm on first load) |
| React StrictMode (dev only) | Effects run twice — doubles prefetch calls |

---

## 4. Total Transferred MB

| Asset type | Estimated transfer |
|------------|-------------------|
| API JSON | ~0.02 MB |
| JS (gzip) | ~0.10 MB |
| CSS (gzip) | ~0.01 MB |
| Logo + fonts | ~0.15 MB |
| Post images (8 unique, first load) | **~2.7 MB** |
| Ad images (from banners HTML) | ~0.3–0.8 MB |
| **Total** | **~3.2–3.8 MB** |

---

## 5. Largest Images

| Image | Size | Download time |
|-------|------|---------------|
| `photo-1573497019940…768x1152.avif` | 340 KB | 2.95s |
| `photo-1541099649105…768x1152.avif` | 333 KB | 2.78s |
| `photo-1573496359142…768x1151.avif` | 241 KB | 2.85s |
| Hero variants (1024px) | 160–280 KB | 1.6–2.0s |

API provides `srcset` with 300w/370w variants — cards were using 768w `url` field.

---

## 6. Largest JS Bundles (Production build)

| File | Raw | Gzip |
|------|-----|------|
| `index-*.js` (main + Home) | 298 KB | 99 KB |
| `BlogDetails-*.js` | 20 KB | 5.8 KB |
| `CategoryPage-*.js` | 17 KB | 5.9 KB |
| `index-*.css` | 49 KB | 9 KB |

Main bundle includes Home (eager), all ad logic, React Query, axios, lucide-react.

---

## 7. Component / Re-render Analysis

| Issue | Severity |
|-------|----------|
| 15 `AdSlot` mount → 15 `useQuery` observers | Medium — all hydrate together causing batch re-render |
| `BannersProvider` state update on fetch complete | Low — triggers context consumers (BlogDetails only) |
| Home renders all sections when `posts` arrives | Medium — 50+ images start loading simultaneously |
| No virtualization for repeated post slices | Low — same 8 posts in many sections |
| `React.StrictMode` double effects | Dev only |

---

## 8. Ad Fetching Logic

- **Before:** `prefetchHomepageAds` on Home mount (competes with `/homepage`) + `BannersProvider` immediate fetch
- **17 AdSlot instances** each subscribed to `useAd(adId)`
- `hydrateAdCache` re-fetched each ID individually after banners Map was already populated

---

## 9. Lazy Loading Implementation (Before)

| Area | Status |
|------|--------|
| Route-level code splitting | ✅ Category, Blog, Content lazy |
| Home page | ❌ Fully eager |
| Ad slots | ❌ All 15 mount immediately |
| Images below fold | ⚠️ `loading="lazy"` set but all DOM nodes exist at once |
| BannersProvider | ❌ Fetches on every app load |
| InstagramGallery | ❌ Eager import |

---

## 9. Optimizations Implemented

### Critical path
1. **Prefetch `/homepage` in `main.jsx`** before React render — starts API call immediately
2. **Defer `/banners`** to `requestIdleCallback` (BannersProvider + ad prefetch) — removes ~2.9s from critical path
3. **`preconnect` + `dns-prefetch`** to `sassystrides.com` in `index.html`

### Ad system
4. **`hydrateHomepageAdCache`** reads banners Map directly — no 17× `fetchAdById` round trips
5. **`LazyAdSlot`** — 14 of 15 ad slots load only when scrolled near viewport
6. Only slot 1 (hero ad) loads immediately

### Images
7. **`getCardImageProps`** — cards use 370w/300w from srcset instead of 768w (~60% smaller)
8. Applied to `BlogCard` and `MoodCarousel`

### Code splitting
9. **`InstagramGallery`** lazy-loaded on Home
10. **Vite `manualChunks`** — splits React and React Query into separate cached chunks
11. **`MoodCarousel`** wrapped in `memo`

---

## 10. Expected Results After Optimization

| Metric | Before | After (est.) |
|--------|--------|--------------|
| Critical path API calls | 2 sequential (~5.6s) | 1 (`/homepage` ~2.7s) |
| Time to first content | ~5.6s | **~2.7s** (API bound) |
| Time to fully loaded | ~8s | **~4–5s** (images still slow from WP host) |
| Ad network on initial paint | 1–2 | 0 (deferred) |
| Card image size | 768w (~300 KB) | 370w (~70–120 KB) |

> **Sub-2s homepage requires WordPress/server fixes** (see below). Frontend optimizations remove ~3s of unnecessary work.

---

## 11. Backend Recommendations (Required for < 2s)

1. **Enable object caching** (Redis/Memcached) on WordPress — target API TTFB < 200ms
2. **CDN** for `sassystrides.com/wp-content` images — current image TTFB is 1.5–3s
3. **Combine endpoints:** `GET /sassy/v1/homepage-bundle` returning posts + banners in one response
4. **HTTP cache headers** on `/homepage` and `/banners` (currently `cache: no-store` on ad fetches)

---

## 12. Verification Checklist

```bash
# Measure API latency
curl -w "time_total: %{time_total}s size: %{size_download}\n" -o /dev/null -s \
  "https://sassystrides.com/wp-json/sassy/v1/homepage?v=20260601"

# Production build sizes
npm run build && ls -lh dist/assets/
```

**DevTools → Network (disable cache, fast 3G):**
- [ ] Only `/homepage` blocks first paint
- [ ] `/banners` fires after idle, not before LCP
- [ ] Below-fold ads load on scroll
- [ ] Card images request 370w/300w variants

---

## 13. Files Changed

| File | Change |
|------|--------|
| `main.jsx` | Early homepage prefetch; deferred ad prefetch |
| `context/BannersContext.jsx` | Idle-deferred banner fetch |
| `services/adQueries.js` | Direct Map hydration (no 17× fetch) |
| `components/ads/LazyAdSlot.jsx` | IntersectionObserver ad loading |
| `pages/Home.jsx` | LazyAdSlot, lazy InstagramGallery, image utils |
| `utils/imageSizes.js` | Srcset picker for smaller card images |
| `components/BlogCard.jsx` | Optimized image URLs |
| `index.html` | preconnect to WordPress origin |
| `vite.config.js` | manualChunks for vendor splitting |
