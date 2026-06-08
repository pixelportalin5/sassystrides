# Category Ads Investigation Report

**Date:** June 8, 2026  
**Affected pages:** Fashion, Beauty, Lifestyle, Trends  
**Homepage:** Not modified

---

## Which component renders category ads?

Category ads are rendered by **`AdSlot`** (`src/components/ads/AdSlot.jsx`) with `page="category"`.

| Slot | Ad ID | Mounted in | Variant |
|------|-------|------------|---------|
| 4 | 1607 | `CategoryPage.jsx` (after hero) | `category-billboard` |
| 1 | 1600 | `CategoryPostGrid.jsx` → row 1 | `category-compact` |
| 2 | 1602 | `CategoryPostGrid.jsx` → row 1 | `category-medium` |
| 3 | 1605 | `CategoryPostGrid.jsx` → row 2 | `category-compact` |
| 5 | 1609 | `CategoryPostGrid.jsx` → row 3 | `category-inline` |
| 6 | 1611 | `CategoryPostGrid.jsx` → row 4 | `category-compact` |
| 7 | 1613 | `CategoryPage.jsx` (after grid) | `category-inline` |

**Gating:** `isFeaturedPage(routeSlug)` in `src/utils/featuredPages.js` — only Fashion, Beauty, Lifestyle, Trends show ads. News page intentionally has no category ads.

**Not used on category pages:**
- `CategoryBanner.jsx` — only used in `BlogDetails.jsx` sidebar
- `CategoryAdInsertion.jsx` — does not exist in codebase
- `EditorialAds.jsx` — used for article inline ads via `BannersContext`, not category pages
- `FeaturedPageAds.jsx` — unused legacy component

---

## Which API endpoint is called?

For each category ad ID (`1600`, `1602`, `1605`, `1607`, `1609`, `1611`, `1613`):

```
GET /wp-json/wp/v2/media?parent={adId}&per_page=1
GET /wp-json/wp/v2/advanced_ads/{adId}  (optional, for title)
```

Fetched via `advancedAdsService.js` → `loadAdMedia()` → `fetchAdById()`.

**Live API verification (all returned 200 with valid images):**

| ID | Image |
|----|-------|
| 1600 | Category-Page-Image-1-300-250.png |
| 1602 | Category-Page-Image-2-600-250.jpg |
| 1605 | Category-Page-Image-3-300-250.jpg |
| 1607 | Category-Page-Image-4-1920-450.jpg |
| 1609 | Category-Page-Image-5-1200-250.png |
| 1611 | Category-Page-Image-6-300-250.jpg |
| 1613 | Category-Page-Image-7-1200-250.jpeg |

Slot → ID mapping in `src/constants/adSlotMappings.js` is correct.

---

## Why the ads disappeared

### Root cause: `AdSlot` hid ads during background refetch

After the performance optimization, `CategoryPage` calls `prefetchCategoryAds()` on mount. This hydrates React Query cache for all 7 ad IDs.

`AdSlot` had this guard:

```javascript
if (isFetching || !ad || !imageUrl) {
  return null;
}
```

When `prefetchCategoryAds` triggered a **background refetch**, `isFetching` became `true` even while valid ad data existed. Every category `AdSlot` returned `null` — ads vanished.

### Contributing issue: null cached in React Query

`hydrateCategoryAdCache` wrote `null` into the query cache for failed fetches:

```javascript
queryClient.setQueryData(adQueryKeys.byId(adId), ad ?? null);
```

A transient failure cached `null` as successful data, preventing retries for 5 minutes.

### Not the cause

- API endpoints work (verified live)
- Slot mappings unchanged
- Components still mounted on all 4 featured category pages
- `wordpress.js` proxy config is correct
- Homepage changes did not remove category `AdSlot` usage

---

## What was fixed

| File | Fix |
|------|-----|
| `AdSlot.jsx` | Removed `isFetching` guard — only hide when `!ad \|\| !imageUrl`. Added `console.log('Category ad data:', ad)` for category slots. |
| `adQueries.js` | Only write to React Query cache when ad data is valid (never cache `null`). |
| `useAd.js` | Category ads retry 2× on failure; `placeholderData` keeps previous ad visible during refetch. |
| `CategoryPage.jsx` | `prefetchCategoryAds` moved to `useLayoutEffect` for earlier hydration. |

**Homepage files not modified.**

---

## Console verification

On Fashion/Beauty/Lifestyle/Trends, open DevTools console. For each visible ad slot you should see:

```
Category ad data: { id: "1600", imageUrl: "https://...", html: "...", ... }
```

If an API request fails, the slot renders nothing (no layout breakage) — `AdSlot` returns `null` without affecting surrounding grid/hero.

---

## Layout preserved

No changes to:
- `CategoryHero`, `CategorySidebar`, `CategoryPostGrid` structure
- Grid row ad insertion logic (`ROW_AD_SLOTS`)
- CSS classes (`featured-page-ad--*`)
- News page (no ads)
