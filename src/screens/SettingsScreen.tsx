import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { APP_BUILD, APP_DISPLAY_NAME, APP_VERSION } from '../config/release';
import { SUPPORTED_LANGUAGES } from '../i18n';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme, type ThemePreference } from '../theme';

const THEME_OPTIONS: ThemePreference[] = ['system', 'light', 'dark'];

type Props = {
  navigation: {
    navigate: (route: string) => void;
  };
};

const SettingsScreen = ({ navigation }: Props) => {
  const { colors, preference, setPreference } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text
        style={[styles.label, { color: colors.textSecondary }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {t('settings.appearance')}
      </Text>
      <View style={styles.themeRow}>
        {THEME_OPTIONS.map(key => {
          const active = preference === key;
          return (
            <Pressable
              key={key}
              onPress={() => setPreference(key)}
              style={[
                styles.themeChip,
                {
                  backgroundColor: active
                    ? colors.chipActiveBg
                    : colors.chipInactiveBg,
                },
              ]}
            >
              <Text
                style={[
                  styles.themeChipText,
                  {
                    color: active
                      ? colors.chipActiveText
                      : colors.chipInactiveText,
                  },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {t(`settings.${key}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text
        style={[styles.hint, { color: colors.textSecondary }]}
        numberOfLines={3}
        ellipsizeMode="tail"
      >
        {t('settings.systemHint')}
      </Text>

      <Text
        style={[styles.label, { color: colors.textSecondary }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {t('settings.language')}
      </Text>
      <View style={styles.themeRow}>
        {SUPPORTED_LANGUAGES.map(({ code, label }) => {
          const active = language === code;
          return (
            <Pressable
              key={code}
              onPress={() => setLanguage(code)}
              style={[
                styles.themeChip,
                {
                  backgroundColor: active
                    ? colors.chipActiveBg
                    : colors.chipInactiveBg,
                },
              ]}
            >
              <Text
                style={[
                  styles.themeChipText,
                  {
                    color: active
                      ? colors.chipActiveText
                      : colors.chipInactiveText,
                  },
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text
        style={[styles.label, { color: colors.textSecondary }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {t('settings.support')}
      </Text>
      <Pressable
        style={[
          styles.feedbackBtn,
          { borderColor: colors.border, backgroundColor: colors.card },
        ]}
        onPress={() => navigation.navigate('Feedback')}
      >
        <View style={styles.feedbackTextWrap}>
          <Text
            style={[styles.feedbackTitle, { color: colors.textPrimary }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {t('settings.feedback')}
          </Text>
          <Text
            style={[styles.feedbackHint, { color: colors.textSecondary }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {t('settings.feedbackHint')}
          </Text>
        </View>
        <Text
          style={[styles.feedbackArrow, { color: colors.textMuted }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          ›
        </Text>
      </Pressable>

      <Text
        style={[styles.footer, { color: colors.textMuted }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {APP_DISPLAY_NAME} v{APP_VERSION} ({APP_BUILD})
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, paddingBottom: 80 },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    minWidth: 0,
  },
  themeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  themeChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    maxWidth: '100%',
    overflow: 'hidden',
  },
  themeChipText: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 0,
  },
  hint: { fontSize: 13, marginTop: 6, lineHeight: 18, minWidth: 0 },
  feedbackBtn: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  feedbackTextWrap: {
    flex: 1,
    minWidth: 0,
    marginRight: 12,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 0,
  },
  feedbackHint: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
    minWidth: 0,
  },
  feedbackArrow: {
    flexShrink: 0,
    fontSize: 28,
    lineHeight: 28,
    minWidth: 0,
  },
  footer: {
    marginTop: 32,
    fontSize: 12,
    textAlign: 'center',
    minWidth: 0,
  },
});

export default SettingsScreen;
