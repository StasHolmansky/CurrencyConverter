import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { NativeModules, Platform } from 'react-native';

import en from './locales/en.json';
import ru from './locales/ru.json';
import es from './locales/es.json';
import ptBR from './locales/pt-BR.json';
import fr from './locales/fr.json';
import de from './locales/de.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'es', label: 'Español' },
  { code: 'pt-BR', label: 'Português (Brasil)' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

function getDeviceLanguage(): string {
  let locale: string | undefined;
  if (Platform.OS === 'ios') {
    locale =
      NativeModules.SettingsManager?.settings?.AppleLocale ??
      NativeModules.SettingsManager?.settings?.AppleLanguages?.[0];
  } else {
    locale = NativeModules.I18nManager?.localeIdentifier;
  }
  return (locale ?? 'en').replace('_', '-');
}

export function resolveLanguage(locale: string): LanguageCode {
  const codes = SUPPORTED_LANGUAGES.map(language => language.code);
  if (codes.includes(locale as LanguageCode)) {
    return locale as LanguageCode;
  }
  const base = locale.split('-')[0];
  return codes.find(code => code === base || code.startsWith(`${base}-`)) ?? 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    es: { translation: es },
    'pt-BR': { translation: ptBR },
    fr: { translation: fr },
    de: { translation: de },
  },
  lng: resolveLanguage(getDeviceLanguage()),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});

export default i18n;
