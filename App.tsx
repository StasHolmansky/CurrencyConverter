import React from 'react';
import './src/i18n';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import MainScreen from './src/screens/MainScreen';
import CurrencyPickerScreen from './src/screens/CurrencyPickerScreen';
import CalculatorScreen from './src/screens/CalculatorScreen';
import FeedbackScreen from './src/screens/FeedbackScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { ThemeProvider, useAppTheme } from './src/theme';
import type { CurrencyItem } from './src/utils/currencyList';
import { LanguageProvider } from './src/i18n/LanguageContext';

export type RootStackParamList = {
  Main: undefined;
  Settings: undefined;
  CurrencyPicker: {
    currencies: CurrencyItem[];
    onSelect: (currencyCode: string, flag: string) => void;
  };
  Calculator: {
    onResult: (value: string) => void;
  };
  Feedback: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function HeaderBackButton({ tintColor, onPress }: { tintColor?: string; onPress?: () => void }) {
  const { t } = useTranslation();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('common.back')}
      onPress={onPress}
      style={styles.backButton}
    >
      <Text style={[styles.backButtonText, { color: tintColor }]}>
        ‹ {t('common.back')}
      </Text>
    </Pressable>
  );
}

const AppNavigator = () => {
  const { navTheme, colors } = useAppTheme();
  const { t } = useTranslation();

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: '600' },
          headerStyle: { backgroundColor: colors.headerBg },
          headerTintColor: colors.textPrimary,
          cardStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Main" component={MainScreen} options={{ title: t('nav.main') }} />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: t('nav.settings'),
            headerLeft: HeaderBackButton,
          }}
        />
        <Stack.Screen name="CurrencyPicker" component={CurrencyPickerScreen} options={{ title: t('nav.currencyPicker') }} />
        <Stack.Screen name="Calculator" component={CalculatorScreen} options={{ title: t('nav.calculator') }} />
        <Stack.Screen
          name="Feedback"
          component={FeedbackScreen}
          options={{
            title: t('nav.feedback'),
            headerLeft: HeaderBackButton,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

const App = () => (
  <LanguageProvider>
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  </LanguageProvider>
);

export default App;
