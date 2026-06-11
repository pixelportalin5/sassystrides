export const LOGO_URL =
  'https://sassystrides.com/wp-content/uploads/2026/03/cropped-Maha-Utsav-Instagram-Post-3.png';

export const BRAND_NAME = 'Sassy Strides';

export const PARENT_CATEGORY_SLUGS = ['fashion', 'beauty', 'lifestyle', 'trends', 'news'];

export const SUBCATEGORIES = [
  {
    parentSlug: 'fashion',
    slug: 'clothing',
    name: 'Clothing',
    description:
      'Discover modern clothing styles, outfit ideas, and wardrobe essentials for every season.',
    keywords: ['clothing', 'outfit', 'wardrobe', 'apparel', 'dress', 'wear'],
  },
  {
    parentSlug: 'fashion',
    slug: 'fashion-week',
    name: 'Fashion Week',
    description:
      'Get runway highlights, designer collections, and global Fashion Week updates.',
    keywords: ['fashion week', 'runway', 'designer', 'collection', 'catwalk'],
  },
  {
    parentSlug: 'fashion',
    slug: 'look-of-the-day',
    name: 'Look of the Day',
    description:
      'Daily fashion inspiration featuring stylish celebrity and influencer outfits.',
    keywords: ['look of the day', 'celebrity', 'influencer', 'outfit', 'style'],
  },
  {
    parentSlug: 'fashion',
    slug: 'accessories',
    name: 'Accessories',
    description:
      'Explore trending bags, jewelry, belts, and fashion accessories to elevate your look.',
    keywords: ['accessories', 'bags', 'jewelry', 'belts', 'handbag'],
  },
  {
    parentSlug: 'fashion',
    slug: 'shoes',
    name: 'Shoes',
    description:
      'Find the latest footwear trends, from sneakers to heels and everyday comfort styles.',
    keywords: ['shoes', 'footwear', 'sneakers', 'heels', 'boots'],
  },
  {
    parentSlug: 'beauty',
    slug: 'hair',
    name: 'Hair',
    description:
      'Haircare tips, hairstyles, and trending hair transformations for every type.',
    keywords: ['hair', 'haircare', 'hairstyle', 'salon'],
  },
  {
    parentSlug: 'beauty',
    slug: 'skin',
    name: 'Skin',
    description:
      'Skincare routines, product guides, and healthy glowing skin solutions.',
    keywords: ['skin', 'skincare', 'glow', 'serum', 'moisturizer'],
  },
  {
    parentSlug: 'beauty',
    slug: 'makeup',
    name: 'Makeup',
    description:
      'Latest makeup trends, tutorials, and product recommendations for all looks.',
    keywords: ['makeup', 'cosmetics', 'lipstick', 'foundation', 'beauty'],
  },
  {
    parentSlug: 'beauty',
    slug: 'nails',
    name: 'Nails',
    description:
      'Nail art ideas, manicure trends, and seasonal nail inspiration.',
    keywords: ['nails', 'manicure', 'nail art', 'polish'],
  },
  {
    parentSlug: 'beauty',
    slug: 'fragrance',
    name: 'Fragrance',
    description:
      'Explore perfumes, scent trends, and fragrance guides for every mood.',
    keywords: ['fragrance', 'perfume', 'scent', 'cologne'],
  },
  {
    parentSlug: 'lifestyle',
    slug: 'airport-style',
    name: 'Airport Style',
    description:
      'Comfortable yet stylish travel outfit ideas for airport looks.',
    keywords: ['airport', 'travel', 'flight', 'luggage'],
  },
  {
    parentSlug: 'lifestyle',
    slug: 'office',
    name: 'Office',
    description:
      'Professional and trendy workwear inspiration for modern office fashion.',
    keywords: ['office', 'workwear', 'professional', 'workplace', 'corporate'],
  },
  {
    parentSlug: 'lifestyle',
    slug: 'street-style',
    name: 'Street Style',
    description:
      'Real-world fashion inspiration from global street style trends.',
    keywords: ['street style', 'streetwear', 'urban'],
  },
  {
    parentSlug: 'lifestyle',
    slug: 'holiday',
    name: 'Holiday',
    description:
      'Vacation outfit ideas and travel fashion inspiration for every destination.',
    keywords: ['holiday', 'vacation', 'resort', 'getaway', 'travel'],
  },
  {
    parentSlug: 'lifestyle',
    slug: 'party',
    name: 'Party',
    description:
      'Glamorous party looks and styling ideas for special occasions.',
    keywords: ['party', 'evening', 'celebration', 'gala', 'occasion'],
  },
  {
    parentSlug: 'trends',
    slug: 'spring',
    name: 'Spring',
    description:
      'Fresh spring fashion, colors, and style inspiration.',
    keywords: ['spring', 'seasonal'],
  },
  {
    parentSlug: 'trends',
    slug: 'summer',
    name: 'Summer',
    description:
      'Lightweight, trendy summer outfits and seasonal beauty looks.',
    keywords: ['summer', 'seasonal'],
  },
  {
    parentSlug: 'trends',
    slug: 'autumn',
    name: 'Autumn',
    description:
      'Warm, stylish autumn fashion and cozy seasonal trends.',
    keywords: ['autumn', 'fall', 'seasonal'],
  },
  {
    parentSlug: 'trends',
    slug: 'winter',
    name: 'Winter',
    description:
      'Elegant winter outfits, layering ideas, and cold-weather style tips.',
    keywords: ['winter', 'layering', 'seasonal'],
  },
  {
    parentSlug: 'news',
    slug: 'awards-events',
    name: 'Awards & Events',
    description:
      'Coverage of fashion awards, red carpet events, and industry shows.',
    keywords: ['awards', 'events', 'red carpet', 'gala', 'ceremony'],
  },
  {
    parentSlug: 'news',
    slug: 'entertainment',
    name: 'Entertainment',
    description:
      'Celebrity news, lifestyle updates, and pop culture stories.',
    keywords: ['entertainment', 'celebrity', 'pop culture'],
  },
];

export const getSubcategoriesByParent = (parentSlug) =>
  SUBCATEGORIES.filter((item) => item.parentSlug === parentSlug);

export const getSubcategoryBySlugs = (parentSlug, subSlug) =>
  SUBCATEGORIES.find((item) => item.parentSlug === parentSlug && item.slug === subSlug) || null;

export const getSubcategoryPath = (parentSlug, subSlug) => `/${parentSlug}/${subSlug}`;
