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
import { APP_DISPLAY_NAME, SUPPORT_EMAIL } from '../config/release';
import { useAppColors } from '../theme';

const FeedbackScreen = () => {
  const colors = useAppColors();

  const openEmail = () => {
    const subject = encodeURIComponent(`Обратная связь ${APP_DISPLAY_NAME}`);
    const url = `mailto:${SUPPORT_EMAIL}?subject=${subject}`;

    Linking.openURL(url).catch(() => {
      Alert.alert(
        'Почтовое приложение не найдено',
        `Пожалуйста, отправьте сообщение вручную на ${SUPPORT_EMAIL}.`,
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
          Обратная связь и предложения
        </Text>
        <Text
          style={[styles.body, { color: colors.textSecondary }]}
          numberOfLines={6}
          ellipsizeMode="tail"
        >
          Если у вас есть идеи, пожелания или вы заметили, что в {APP_DISPLAY_NAME} можно
          улучшить, напишите на почту поддержки ниже.
        </Text>

        <Text
          style={[styles.emailLabel, { color: colors.textMuted }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Почта для связи
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
          Спасибо, что помогаете делать приложение лучше.
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
