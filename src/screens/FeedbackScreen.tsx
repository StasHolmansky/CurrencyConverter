import React from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { APP_DISPLAY_NAME, SUPPORT_EMAIL } from '../config/release';
import { useAppColors } from '../theme';

const FeedbackScreen = () => {
  const colors = useAppColors();
  const { t } = useTranslation();

  const openEmail = () => {
    const subject = encodeURIComponent(
      t('feedback.emailSubject', { appName: APP_DISPLAY_NAME }),
    );
    const url = `mailto:${SUPPORT_EMAIL}?subject=${subject}`;

    Linking.openURL(url).catch(() => {
      Alert.alert(
        t('feedback.emailUnavailableTitle'),
        t('feedback.emailUnavailableMessage', { email: SUPPORT_EMAIL }),
      );
    });
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text
          style={[styles.title, { color: colors.textPrimary }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {t('feedback.title')}
        </Text>
        <Text
          style={[styles.body, { color: colors.textSecondary }]}
          numberOfLines={6}
          ellipsizeMode="tail"
        >
          {t('feedback.body', { appName: APP_DISPLAY_NAME })}
        </Text>

        <Text
          style={[styles.emailLabel, { color: colors.textMuted }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {t('feedback.emailLabel')}
        </Text>
        <Pressable
          style={[styles.emailButton, { backgroundColor: colors.accent }]}
          onPress={openEmail}
        >
          <Text
            style={[styles.emailText, { color: colors.onAccent }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {SUPPORT_EMAIL}
          </Text>
        </Pressable>

        <Text
          style={[styles.note, { color: colors.textMuted }]}
          numberOfLines={4}
          ellipsizeMode="tail"
        >
          {t('feedback.note')}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    padding: 16,
    overflow: 'hidden',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    minWidth: 0,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
    minWidth: 0,
  },
  emailLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 22,
    textTransform: 'uppercase',
    minWidth: 0,
  },
  emailButton: {
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 0,
  },
  note: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 14,
    minWidth: 0,
  },
});

export default FeedbackScreen;
