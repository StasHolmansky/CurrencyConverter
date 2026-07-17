import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import i18n, {
  SUPPORTED_LANGUAGES,
  type LanguageCode,
} from './index';

const LANGUAGE_PREF_KEY = 'languagePreference';

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLanguageCode(value: string): value is LanguageCode {
  return SUPPORTED_LANGUAGES.some(language => language.code === value);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(
    i18n.language as LanguageCode,
  );

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(LANGUAGE_PREF_KEY)
      .then(async savedLanguage => {
        if (!cancelled && savedLanguage && isLanguageCode(savedLanguage)) {
          await i18n.changeLanguage(savedLanguage);
          if (!cancelled) {
            setLanguageState(savedLanguage);
          }
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const setLanguage = useCallback(async (nextLanguage: LanguageCode) => {
    await i18n.changeLanguage(nextLanguage);
    setLanguageState(nextLanguage);
    await AsyncStorage.setItem(LANGUAGE_PREF_KEY, nextLanguage);
  }, []);

  const value = useMemo(
    () => ({ language, setLanguage }),
    [language, setLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
