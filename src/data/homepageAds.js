/**
 * Static homepage banner config from Google Sheet.
 * Direct image URLs on sassystrides.com — no runtime WordPress media lookup.
 * Sheet: https://docs.google.com/spreadsheets/d/16TRZ29JTpLJzHRnqtgAyTTDKN6EDyPKrvVEKYCAMkdU
 */

import { WORDPRESS_SITE_URL, wpContentUrl } from '../config/wordpress';

const parseShortcodeId = (shortcode) => {
  const match = String(shortcode).match(/id="(\d+)"/);
  return match ? match[1] : '';
};

const createBanner = ({ name, shortcode, width, height, uploadPath }) => {
  const id = parseShortcodeId(shortcode);
  const imageUrl = wpContentUrl(uploadPath);

  if (!imageUrl.startsWith(`${WORDPRESS_SITE_URL}/`)) {
    throw new Error(`Banner ${id} imageUrl must use ${WORDPRESS_SITE_URL}`);
  }

  return {
    id,
    name,
    shortcode,
    imageUrl,
    width,
    height,
    layout: width === 300 && (height === 250 || height === 600) ? 'side-card' : 'leaderboard',
  };
};

export const homepageAds = [
  createBanner({
    name: 'Home-Page-Banner-1-1200X200',
    shortcode: '[the_ad id="1549"]',
    width: 1200,
    height: 200,
    uploadPath: '2026/05/Home-Page-Banner-1-1200X200.jpg',
  }),
  createBanner({
    name: 'Home Page Banner 2 - 1170X250',
    shortcode: '[the_ad id="1553"]',
    width: 1170,
    height: 250,
    uploadPath: '2026/05/Home-Page-Banner-2-1170X250.jpg',
  }),
  createBanner({
    name: 'Home Page Banner 3- 1170X250',
    shortcode: '[the_ad id="1552"]',
    width: 1170,
    height: 250,
    uploadPath: '2026/05/Home-Page-Banner-3-1170X250.png',
  }),
  createBanner({
    name: 'Home Page Banner 4- 1200X200',
    shortcode: '[the_ad id="1550"]',
    width: 1200,
    height: 200,
    uploadPath: '2026/05/Home-Page-Banner-4-1200X200.jpeg',
  }),
  createBanner({
    name: 'Home Page Banner 5- 300X250',
    shortcode: '[the_ad id="1551"]',
    width: 300,
    height: 250,
    uploadPath: '2026/05/Home-Page-Banner-5-300X250.jpeg',
  }),
  createBanner({
    name: 'Home Page Banner 6- 300X250',
    shortcode: '[the_ad id="1547"]',
    width: 300,
    height: 250,
    uploadPath: '2026/05/Home-Page-Banner-6-300X250.jpeg',
  }),
  createBanner({
    name: 'Home Page Banner 7- 300X250',
    shortcode: '[the_ad id="1554"]',
    width: 300,
    height: 250,
    uploadPath: '2026/05/Home-Page-Banner-7-300X250.jpg',
  }),
  createBanner({
    name: 'Home Page Banner 8- 728X90',
    shortcode: '[the_ad id="1555"]',
    width: 728,
    height: 90,
    uploadPath: '2026/05/Home-Page-Banner-8-728X90.jpg',
  }),
  createBanner({
    name: 'Home Page Banner 9- 970X250',
    shortcode: '[the_ad id="1523"]',
    width: 970,
    height: 250,
    uploadPath: '2026/04/Home-Page-Banner-9-970X250.jpg',
  }),
  createBanner({
    name: 'Home Page Banner 10- 300X600',
    shortcode: '[the_ad id="1586"]',
    width: 300,
    height: 600,
    uploadPath: '2026/06/Home-Page-Banner-10-300X600.png',
  }),
  createBanner({
    name: 'Home Page Banner 11- 970X250',
    shortcode: '[the_ad id="1588"]',
    width: 970,
    height: 250,
    uploadPath: '2026/06/Home-Page-Banner-11-970X250.png',
  }),
  createBanner({
    name: 'Home Page Banner 12- 728X90',
    shortcode: '[the_ad id="1590"]',
    width: 728,
    height: 90,
    uploadPath: '2026/06/Home-Page-Banner-12-728X90.jpeg',
  }),
  createBanner({
    name: 'Home Page Banner 13- 1200X200',
    shortcode: '[the_ad id="1592"]',
    width: 1200,
    height: 200,
    uploadPath: '2026/06/Home-Page-Banner-13-1200X200.jpeg',
  }),
  createBanner({
    name: 'Home Page Banner 14- 300X600',
    shortcode: '[the_ad id="1594"]',
    width: 300,
    height: 600,
    uploadPath: '2026/06/Home-Page-Banner-14-300X600.png',
  }),
  createBanner({
    name: 'Home Page Banner 15- 1140x150',
    shortcode: '[the_ad id="1596"]',
    width: 1140,
    height: 150,
    uploadPath: '2026/06/Home-Page-Banner-15-1140x150-1.jpeg',
  }),
  createBanner({
    name: 'Home Page Banner 15(2)- 1140x150',
    shortcode: '[the_ad id="1598"]',
    width: 1140,
    height: 150,
    uploadPath: '2026/06/Home-Page-Banner-152-1140x150-1.jpg',
  }),
];

export const logHomepageBannerConfig = () => {
  console.log('[banners] WordPress site URL:', WORDPRESS_SITE_URL);
  console.log('[banners] Total configured:', homepageAds.length);

  homepageAds.forEach((banner) => {
    console.log('[banners] request URL:', banner.imageUrl);
    console.table({
      banner: banner.name,
      id: banner.id,
      imageUrl: banner.imageUrl,
      usesWordPressDomain: banner.imageUrl.startsWith(`${WORDPRESS_SITE_URL}/`),
    });
  });
};

export const homepageAdsById = Object.fromEntries(
  homepageAds.map((banner) => [banner.id, banner]),
);

export const getHomepageAd = (adId) => homepageAdsById[String(adId)] ?? null;

export const homepageBannerSlots = {
  banner1: homepageAds[0],
  banner2: homepageAds[1],
  banner3: homepageAds[2],
  banner4: homepageAds[3],
  banner5: homepageAds[4],
  banner6: homepageAds[5],
  banner7: homepageAds[6],
  banner8: homepageAds[7],
  banner9: homepageAds[8],
  banner10: homepageAds[9],
  banner11: homepageAds[10],
  banner12: homepageAds[11],
  banner13: homepageAds[12],
  banner14: homepageAds[13],
  banner15: homepageAds[14],
  banner15b: homepageAds[15],
};

export const homepageAdPlacements = {
  afterHero: '1549',
  afterFeaturedStories: '1553',
  afterTrending: '1552',
  afterFashion: '1550',
  afterBeauty: '1551',
  afterLifestyle: '1554',
  afterInstagram: '1555',
  afterLatestArticles: '1523',
  afterEditorsPicks: '1586',
  afterNewsletter: '1588',
  afterPopularStories: '1590',
  afterFashionSpotlight: '1592',
  afterLuxuryPicks: '1594',
  beforeFooter: '1596',
  footerTop: '1598',
};
