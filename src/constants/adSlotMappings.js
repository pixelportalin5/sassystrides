export const HOMEPAGE_AD_SLOTS = {
  1: '1549',
  2: '1553',
  3: '1552',
  4: '1550',
  5: '1551',
  6: '1547',
  7: '1554',
  8: '1555',
  9: '1523',
  10: '1586',
  11: '1588',
  12: '1590',
  13: '1592',
  14: '1594',
  15: '1596',
  '15b': '1598',
};

export const CATEGORY_AD_SLOTS = {
  1: '1600',
  2: '1602',
  3: '1605',
  4: '1607',
  5: '1609',
  6: '1611',
  7: '1613',
};

export const HOMEPAGE_AD_IDS = Object.values(HOMEPAGE_AD_SLOTS);

export const CATEGORY_AD_IDS = Object.values(CATEGORY_AD_SLOTS);

export const getAdIdForSlot = (page, slot) => {
  const normalizedSlot = typeof slot === 'number' ? slot : String(slot);
  const map = page === 'category' ? CATEGORY_AD_SLOTS : HOMEPAGE_AD_SLOTS;
  return map[normalizedSlot] ?? null;
};
