import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './src/screens/MainScreen';
import CurrencyPickerScreen from './src/screens/CurrencyPickerScreen';
import CalculatorScreen from './src/screens/CalculatorScreen';
import { ThemeProvider, useAppTheme } from './src/theme';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { navTheme } = useAppTheme();

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainScreen} options={{ title: 'Конвертер валют' }} />
        <Stack.Screen name="CurrencyPicker" component={CurrencyPickerScreen} options={{ title: 'Выбор валюты' }} />
        <Stack.Screen name="Calculator" component={CalculatorScreen} options={{ title: 'Калькулятор' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => (
  <ThemeProvider>
    <AppNavigator />
  </ThemeProvider>
);

export default App;
