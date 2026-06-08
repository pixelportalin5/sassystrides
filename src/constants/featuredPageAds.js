export const FEATURED_PAGE_SLUGS = ['fashion', 'beauty', 'lifestyle', 'trends'];

export const FEATURED_PAGE_BANNER_ORDER = [
  '1600',
  '1602',
  '1605',
  '1607',
  '1609',
  '1611',
  '1613',
];

export const FEATURED_PAGE_BANNER_LAYOUT = {
  1600: 'compact',
  1602: 'medium',
  1605: 'compact',
  1607: 'billboard',
  1609: 'leaderboard',
  1611: 'compact',
  1613: 'leaderboard',
};

const CATEGORY_UPLOAD_BASE = 'https://sassystrides.com/wp-content/uploads/2026/06';

export const FEATURED_PAGE_BANNER_IMAGE_FALLBACKS = {
  1600: {
    imageUrl: `${CATEGORY_UPLOAD_BASE}/Category-Page-Image-1-300-250.png`,
    width: 300,
    height: 250,
    filename: 'Category-Page-Image-1-300-250',
  },
  1602: {
    imageUrl: `${CATEGORY_UPLOAD_BASE}/Category-Page-Image-2-600-250.jpg`,
    width: 600,
    height: 250,
    filename: 'Category-Page-Image-2-600-250',
  },
  1605: {
    imageUrl: `${CATEGORY_UPLOAD_BASE}/Category-Page-Image-3-300-250.jpg`,
    width: 300,
    height: 250,
    filename: 'Category-Page-Image-3-300-250',
  },
  1607: {
    imageUrl: `${CATEGORY_UPLOAD_BASE}/Category-Page-Image-4-1920-450.jpg`,
    width: 1920,
    height: 450,
    filename: 'Category-Page-Image-4-1920-450',
  },
  1609: {
    imageUrl: `${CATEGORY_UPLOAD_BASE}/Category-Page-Image-5-1200-250.png`,
    width: 1200,
    height: 250,
    filename: 'Category-Page-Image-5-1200-250',
  },
  1611: {
    imageUrl: `${CATEGORY_UPLOAD_BASE}/Category-Page-Image-6-300-250.jpg`,
    width: 300,
    height: 250,
    filename: 'Category-Page-Image-6-300-250',
  },
  1613: {
    imageUrl: `${CATEGORY_UPLOAD_BASE}/Category-Page-Image-7-1200-250.jpeg`,
    width: 1200,
    height: 250,
    filename: 'Category-Page-Image-7-1200-250',
  },
};
