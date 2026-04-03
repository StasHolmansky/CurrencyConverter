import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE = 'https://open.er-api.com/v6/latest/USD';
const STORAGE_KEY = 'cached_rates_v2';
const REFRESH_INTERVAL = 24 * 60 * 60 * 1000;

interface RatesCache {
  timestamp: number;
  rates: Record<string, number>;
}

export const fetchFreshRates = async (): Promise<Record<string, number>> => {
  const response = await axios.get(API_BASE);
  return response.data.rates;
};

export const cacheRates = async (rates: Record<string, number>) => {
  const cache: RatesCache = {
    timestamp: Date.now(),
    rates,
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
};

const getCachedRates = async (): Promise<RatesCache | null> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as RatesCache;
};

export const loadRates = async (onUpdate?: (rates: Record<string, number>) => void): Promise<Record<string, number>> => {
  const cached = await getCachedRates();

  const refreshInBackground = () => {
    fetchFreshRates()
      .then(fresh => {
        cacheRates(fresh);
        if (onUpdate) onUpdate(fresh);
      })
      .catch(() => {});
  };

  if (cached) {
    const isStale = Date.now() - cached.timestamp > REFRESH_INTERVAL;
    if (isStale) {
      refreshInBackground();
    }
    return cached.rates;
  }

  try {
    const fresh = await fetchFreshRates();
    await cacheRates(fresh);
    return fresh;
  } catch {
    return {};
  }
};
