import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useAppColors } from '../theme';

interface Props {
  navigation: any;
  route: {
    params: {
      onResult: (value: string) => void;
    };
  };
}

const CalculatorScreen: React.FC<Props> = ({ navigation, route }) => {
  const colors = useAppColors();
  const [expression, setExpression] = useState('');
  const { onResult } = route.params;

  const handlePress = (value: string) => {
    if (value === '=') {
      try {
        // eslint-disable-next-line no-eval
        const result = eval(expression.replace(/×/g, '*').replace(/÷/g, '/'));
        setExpression(String(result));
        onResult(String(result));
        navigation.goBack();
      } catch {
        setExpression('Ошибка');
      }
    } else if (value === 'C') {
      setExpression('');
    } else {
      setExpression(prev => prev + value);
    }
  };

  const buttons = [
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '-'],
    ['0', '.', 'C', '+'],
    ['='],
  ];

  const isOp = (btn: string) => ['÷', '×', '-', '+'].includes(btn);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.display, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.expression, { color: colors.textPrimary }]}>{expression || '0'}</Text>
      </View>
      <View style={styles.buttons}>
        {buttons.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map(btn => (
              <TouchableOpacity
                key={btn}
                style={[
                  styles.button,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                  isOp(btn) && { backgroundColor: colors.accent, borderColor: colors.accent },
                  btn === '=' && styles.equalButton,
                  btn === '=' && { backgroundColor: colors.success, borderColor: colors.success },
                  btn === 'C' && { backgroundColor: colors.danger, borderColor: colors.danger },
                ]}
                onPress={() => handlePress(btn)}
              >
                <Text style={[
                  styles.buttonText,
                  { color: colors.textPrimary },
                  (isOp(btn) || btn === '=' || btn === 'C') && { color: colors.onAccent },
                ]}>
                  {btn}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  display: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 20,
    margin: 10,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  expression: { fontSize: 48 },
  buttons: { flex: 2, padding: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  button: {
    padding: 20,
    borderRadius: 40,
    width: 80,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  equalButton: { width: 'auto', flex: 1 },
  buttonText: { fontSize: 28 },
});

export default CalculatorScreen;
