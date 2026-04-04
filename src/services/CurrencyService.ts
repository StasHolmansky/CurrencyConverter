import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const FIAT_API = 'https://open.er-api.com/v6/latest/USD';
const CRYPTO_API = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd';
const STORAGE_KEY = 'cached_rates_v3';
const REFRESH_INTERVAL = 24 * 60 * 60 * 1000;

const CRYPTO_ID_TO_CODE: Record<string, string> = {
  bitcoin: 'BTC',
  ethereum: 'ETH',
  tether: 'USDT',
};

interface RatesCache {
  timestamp: number;
  rates: Record<string, number>;
}

const fetchCryptoRates = async (): Promise<Record<string, number>> => {
  try {
    const response = await axios.get(CRYPTO_API);
    const result: Record<string, number> = {};
    for (const [id, code] of Object.entries(CRYPTO_ID_TO_CODE)) {
      const priceInUsd = response.data[id]?.usd;
      if (priceInUsd && priceInUsd > 0) {
        result[code] = 1 / priceInUsd;
      }
    }
    return result;
  } catch {
    return {};
  }
};

export const fetchFreshRates = async (): Promise<Record<string, number>> => {
  const [fiatResponse, cryptoRates] = await Promise.all([
    axios.get(FIAT_API),
    fetchCryptoRates(),
  ]);
  return { ...fiatResponse.data.rates, ...cryptoRates };
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
