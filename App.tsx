import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Pressable, StyleSheet, Text } from 'react-native';
import MainScreen from './src/screens/MainScreen';
import CurrencyPickerScreen from './src/screens/CurrencyPickerScreen';
import CalculatorScreen from './src/screens/CalculatorScreen';
import FeedbackScreen from './src/screens/FeedbackScreen';
import { ThemeProvider, useAppTheme } from './src/theme';
import type { CurrencyItem } from './src/utils/currencyList';

export type RootStackParamList = {
  Main: undefined;
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
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Назад"
      onPress={onPress}
      style={styles.backButton}
    >
      <Text style={[styles.backButtonText, { color: tintColor }]}>‹ Назад</Text>
    </Pressable>
  );
}

const AppNavigator = () => {
  const { navTheme } = useAppTheme();

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: '600' },
          headerStyle: { backgroundColor: navTheme.colors.card },
          headerTintColor: navTheme.colors.text,
          cardStyle: { backgroundColor: navTheme.colors.background },
        }}
      >
        <Stack.Screen name="Main" component={MainScreen} options={{ title: 'Конвертер валют' }} />
        <Stack.Screen name="CurrencyPicker" component={CurrencyPickerScreen} options={{ title: 'Выбор валюты' }} />
        <Stack.Screen name="Calculator" component={CalculatorScreen} options={{ title: 'Калькулятор' }} />
        <Stack.Screen
          name="Feedback"
          component={FeedbackScreen}
          options={{
            title: 'Обратная связь',
            headerTintColor: navTheme.colors.primary,
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
  <ThemeProvider>
    <AppNavigator />
  </ThemeProvider>
);

export default App;
