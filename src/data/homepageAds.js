/**
 * Homepage banner config sourced from Google Sheet (order, shortcode IDs, dimensions).
 * Image URLs are hints only — resolved at runtime via bannerImageResolver.
 * Sheet: https://docs.google.com/spreadsheets/d/16TRZ29JTpLJzHRnqtgAyTTDKN6EDyPKrvVEKYCAMkdU
 */

export const HOMEPAGE_BANNER_PLACEHOLDER = '/placeholder-banner.jpg';

const parseShortcodeId = (shortcode) => {
  const match = String(shortcode).match(/id="(\d+)"/);
  return match ? match[1] : '';
};

const createBanner = ({
  order,
  name,
  shortcode,
  width,
  height,
  expectedUrl,
  mediaSearchToken,
}) => {
  const id = parseShortcodeId(shortcode);

  return {
    order,
    id,
    name,
    shortcode,
    width,
    height,
    expectedUrl,
    image: expectedUrl,
    mediaSearchToken,
    layout: width === 300 && (height === 250 || height === 600) ? 'side-card' : 'leaderboard',
  };
};

export const homepageAds = [
  createBanner({
    order: 1,
    name: 'Home-Page-Banner-1-1200X200',
    shortcode: '[the_ad id="1549"]',
    width: 1200,
    height: 200,
    expectedUrl: 'https://sassystrides.com/wp-content/uploads/2026/05/Home-Page-Banner-1-1200X200.jpg',
    mediaSearchToken: 'Home-Page-Banner-1',
  }),
  createBanner({
    order: 2,
    name: 'Home Page Banner 2 - 1170X250',
    shortcode: '[the_ad id="1553"]',
    width: 1170,
    height: 250,
    expectedUrl: 'https://sassystrides.com/wp-content/uploads/2026/05/Home-Page-Banner-2-1170X250.jpg',
    mediaSearchToken: 'Home-Page-Banner-2',
  }),
  createBanner({
    order: 3,
    name: 'Home Page Banner 3- 1170X250',
    shortcode: '[the_ad id="1552"]',
    width: 1170,
    height: 250,
    expectedUrl: 'https://sassystrides.com/wp-content/uploads/2026/05/Home-Page-Banner-3-1170X250.png',
    mediaSearchToken: 'Home-Page-Banner-3',
  }),
  createBanner({
    order: 4,
    name: 'Home Page Banner 4- 1200X200',
    shortcode: '[the_ad id="1550"]',
    width: 1200,
    height: 200,
    expectedUrl: 'https://sassystrides.com/wp-content/uploads/2026/05/Home-Page-Banner-4-1200X200.jpeg',
    mediaSearchToken: 'Home-Page-Banner-4',
  }),
  createBanner({
    order: 5,
    name: 'Home Page Banner 5- 300X250',
    shortcode: '[the_ad id="1551"]',
    width: 300,
    height: 250,
    expectedUrl: 'https://sassystrides.com/wp-content/uploads/2026/05/Home-Page-Banner-5-300X250.jpeg',
    mediaSearchToken: 'Home-Page-Banner-5',
  }),
  createBanner({
    order: 6,
    name: 'Home Page Banner 6- 300X250',
    shortcode: '[the_ad id="1547"]',
    width: 300,
    height: 250,
    expectedUrl: 'https://sassystrides.com/wp-content/uploads/2026/05/Home-Page-Banner-6-300X250.jpeg',
    mediaSearchToken: 'Home-Page-Banner-6',
  }),
  createBanner({
    order: 7,
    name: 'Home Page Banner 7- 300X250',
    shortcode: '[the_ad id="1554"]',
    width: 300,
    height: 250,
    expectedUrl: 'https://sassystrides.com/wp-content/uploads/2026/05/Home-Page-Banner-7-300X250.jpg',
    mediaSearchToken: 'Home-Page-Banner-7',
  }),
  createBanner({
    order: 8,
    name: 'Home Page Banner 8- 728X90',
    shortcode: '[the_ad id="1555"]',
    width: 728,
    height: 90,
    expectedUrl: 'https://sassystrides.com/wp-content/uploads/2026/05/Home-Page-Banner-8-728X90.jpg',
    mediaSearchToken: 'Home-Page-Banner-8',
  }),
  createBanner({
    order: 9,
    name: 'Home Page Banner 9- 970X250',
    shortcode: '[the_ad id="1523"]',
    width: 970,
    height: 250,
    expectedUrl: 'https://sassystrides.com/wp-content/uploads/2026/04/Home-Page-Banner-9-970X250.jpg',
    mediaSearchToken: 'Home-Page-Banner-9',
  }),
  createBanner({
    order: 10,
    name: 'Home Page Banner 10- 300X600',
    shortcode: '[the_ad id="1586"]',
    width: 300,
    height: 600,
    expectedUrl: 'https://sassystrides.com/wp-content/uploads/2026/06/Home-Page-Banner-10-300X600.png',
    mediaSearchToken: 'Home-Page-Banner-10',
  }),
  createBanner({
    order: 11,
    name: 'Home Page Banner 11- 970X250',
    shortcode: '[the_ad id="1588"]',
    width: 970,
    height: 250,
    expectedUrl: 'https://sassystrides.com/wp-content/uploads/2026/06/Home-Page-Banner-11-970X250.png',
    mediaSearchToken: 'Home-Page-Banner-11',
  }),
  createBanner({
    order: 12,
    name: 'Home Page Banner 12- 728X90',
    shortcode: '[the_ad id="1590"]',
    width: 728,
    height: 90,
    expectedUrl: 'https://sassystrides.com/wp-content/uploads/2026/06/Home-Page-Banner-12-728X90.jpeg',
    mediaSearchToken: 'Home-Page-Banner-12',
  }),
  createBanner({
    order: 13,
    name: 'Home Page Banner 13- 1200X200',
    shortcode: '[the_ad id="1592"]',
    width: 1200,
    height: 200,
    expectedUrl: 'https://sassystrides.com/wp-content/uploads/2026/06/Home-Page-Banner-13-1200X200.jpeg',
    mediaSearchToken: 'Home-Page-Banner-13',
  }),
  createBanner({
    order: 14,
    name: 'Home Page Banner 14- 300X600',
    shortcode: '[the_ad id="1594"]',
    width: 300,
    height: 600,
    expectedUrl: 'https://sassystrides.com/wp-content/uploads/2026/06/Home-Page-Banner-14-300X600.png',
    mediaSearchToken: 'Home-Page-Banner-14',
  }),
  createBanner({
    order: 15,
    name: 'Home Page Banner 15- 1140x150',
    shortcode: '[the_ad id="1596"]',
    width: 1140,
    height: 150,
    expectedUrl: 'https://sassystrides.com/wp-content/uploads/2026/06/Home-Page-Banner-15-1140x150-1.jpeg',
    mediaSearchToken: 'Home-Page-Banner-15',
  }),
  createBanner({
    order: '15(2)',
    name: 'Home Page Banner 15(2)- 1140x150',
    shortcode: '[the_ad id="1598"]',
    width: 1140,
    height: 150,
    expectedUrl: 'https://sassystrides.com/wp-content/uploads/2026/06/Home-Page-Banner-152-1140x150-1.jpg',
    mediaSearchToken: 'Home-Page-Banner-152',
  }),
];

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
