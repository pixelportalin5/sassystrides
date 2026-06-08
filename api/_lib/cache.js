const CACHE_TTL_MS = 60 * 60 * 1000;
const store = new Map();

export const getCached = (key) => {
  const entry = store.get(key);

  if (!entry || Date.now() - entry.fetchedAt > CACHE_TTL_MS) {
    store.delete(key);
    return null;
  }

  return entry.data;
};

export const setCached = (key, data) => {
  store.set(key, {
    data,
    fetchedAt: Date.now(),
  });
};

export const CACHE_CONTROL = 'public, s-maxage=3600, stale-while-revalidate=86400';
