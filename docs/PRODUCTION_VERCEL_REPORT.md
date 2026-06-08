# Production Vercel Investigation Report

**Date:** June 2026  
**Symptoms:** Homepage works; blog detail pages fail; category ads don't load (local works fine)

---

## vercel.json — Verified

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/wp-json/sassy/v1/:path*", "destination": "https://sassystrides.com/wp-json/sassy/v1/:path*" },
    { "source": "/wp-json/wp/v2/:path*", "destination": "https://sassystrides.com/wp-json/wp/v2/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

| Route | Expected behavior after fix |
|-------|----------------------------|
| `/fashion`, `/beauty`, `/lifestyle`, `/trends` | SPA → `index.html`, React Router renders CategoryPage |
| `/blog/*` | SPA → `index.html`, React Router renders BlogDetails |
| `/wp-json/sassy/v1/*` | Proxied to WordPress (posts API) |
| `/wp-json/wp/v2/*` | Proxied to WordPress (category ads API) |

---

## Root Cause: CORS + Wrong API URL Strategy

### WordPress API has NO `Access-Control-Allow-Origin`

Live header check on `sassystrides.com/wp-json/*`:

```
HTTP/2 200
access-control-expose-headers: X-WP-Total, X-WP-TotalPages, Link
access-control-allow-headers: Authorization, X-WP-Nonce, ...
(NO access-control-allow-origin)
```

**Direct browser fetch from `*.vercel.app` → `https://sassystrides.com/wp-json/...` is blocked by CORS.**

### Previous `wordpress.js` logic (broken on Vercel)

```javascript
// OLD — when hostname matched WORDPRESS_SITE_URL, used absolute URL:
if (window.location.hostname !== wordpressHostname) {
  return '/wp-json/sassy/v1';  // proxy ✓
}
return `${WORDPRESS_SITE_URL}/wp-json/sassy/v1`;  // absolute — CORS fail if cross-origin
```

When the Vercel deployment hostname matched `VITE_WORDPRESS_URL` (or fell through incorrectly), API calls went **directly to sassystrides.com** instead of same-origin `/wp-json/*` rewrites.

### Why homepage appeared to work

- Homepage loads at `/` with posts prefetched early in `main.jsx`
- If posts prefetch succeeded once (cached in React Query), homepage renders from cache
- Blog pages require **fresh** `/post/{slug}` requests — fail on CORS
- Category ads use **`/wp-json/wp/v2`** — fail if not proxied correctly

---

## API Endpoints (all return 200 from server — CORS is the browser issue)

| Endpoint | Purpose | Server status |
|----------|---------|---------------|
| `/wp-json/sassy/v1/homepage` | Homepage posts | 200 |
| `/wp-json/sassy/v1/post/{slug}` | Blog detail | 200 |
| `/wp-json/sassy/v1/category/{slug}` | Category posts | 200 |
| `/wp-json/wp/v2/advanced_ads?include=1600,...` | Category ads batch | 200 |
| `/wp-json/wp/v2/media?parent=1600` | Category ad images | 200 |

---

## Failed Request Patterns (before fix)

| Request type | URL pattern | Browser result |
|--------------|-------------|----------------|
| Posts (cross-origin) | `https://sassystrides.com/wp-json/sassy/v1/post/...` | CORS blocked |
| Ads (cross-origin) | `https://sassystrides.com/wp-json/wp/v2/...` | CORS blocked |
| Blog hard refresh (no vercel.json) | `/blog/slug` | 404 NOT_FOUND |

---

## Fixes Applied

### 1. `src/config/wordpress.js`
- **Always** use same-origin `/wp-json/sassy/v1` and `/wp-json/wp/v2` in production
- `VITE_WORDPRESS_URL` now only used for **image/asset URLs** (`wpContentUrl`)
- Production console logs:
  - WordPress base URL
  - Posts API URL (`window.origin + /wp-json/sassy/v1`)
  - Ads API URL (`window.origin + /wp-json/wp/v2`)

### 2. `src/services/wordpressApi.js`
- Resolve `baseURL` on **every request** via axios interceptor (not module-load time)
- Production: `redirect: 'follow'` (dev keeps `manual` for Vite proxy debugging)
- Log failed posts API requests with URL + status code

### 3. `src/services/advancedAdsService.js`
- Log failed ads API requests with URL + status code

### 4. `vercel.json`
- Explicit `buildCommand` + `outputDirectory`
- API rewrites **before** SPA catch-all

### 5. `.env.example`
- Documents `VITE_WORDPRESS_URL` for Vercel env vars

---

## VITE_WORDPRESS_URL on Vercel

Set in **Vercel → Project Settings → Environment Variables → Production**:

```
VITE_WORDPRESS_URL=https://sassystrides.com
```

This is baked in at **build time**. Used for image URLs only after this fix.

---

## No localhost URLs in production code

Searched codebase — no hardcoded `localhost` or `127.0.0.1` in source (only in comments).

---

## Post-deploy verification

1. Open production site → DevTools Console:
   ```
   [wordpress] WordPress base URL: https://sassystrides.com
   [wordpress] Posts API URL: https://YOUR-VERCEL-APP.vercel.app/wp-json/sassy/v1
   [wordpress] Ads API URL: https://YOUR-VERCEL-APP.vercel.app/wp-json/wp/v2
   ```

2. DevTools Network — confirm requests go to **your Vercel origin** `/wp-json/...`, NOT `sassystrides.com/wp-json/...`

3. Hard refresh:
   - `/fashion` ✓
   - `/blog/office-bag-essentials-finding-the-perfect-tote-for-your-laptop-and-life` ✓

4. Category page → Network → `advanced_ads?include=1600,...` returns 200 via `/wp-json/wp/v2/...`
