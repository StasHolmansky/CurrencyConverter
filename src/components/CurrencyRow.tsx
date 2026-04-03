import React, { useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { AppColors } from '../theme';

interface Props {
  flag: string;
  currencyCode: string;
  amount: string;
  colors: AppColors;
  onPressCurrency: () => void;
  onAmountChange: (text: string) => void;
  onFocus?: () => void;
  onDelete?: () => void;
}

const CurrencyRow: React.FC<Props> = ({
  flag,
  currencyCode,
  amount,
  colors,
  onPressCurrency,
  onAmountChange,
  onFocus,
  onDelete,
}) => {
  const swipeableRef = useRef<Swipeable>(null);

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0.5],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        style={[styles.deleteAction, { backgroundColor: colors.delete }]}
        onPress={() => {
          swipeableRef.current?.close();
          onDelete?.();
        }}
      >
        <Animated.Text style={[styles.deleteText, { transform: [{ scale }] }]}>
          Удалить
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={onDelete ? renderRightActions : undefined}
      overshootRight={false}
      friction={2}
    >
      <View style={[styles.row, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={onPressCurrency} style={styles.currencySelector}>
          <Text style={styles.flag}>{flag}</Text>
          <Text style={[styles.code, { color: colors.text }]}>{currencyCode}</Text>
        </TouchableOpacity>
        <TextInput
          style={[styles.input, { color: colors.text, borderBottomColor: colors.inputBorder }]}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={onAmountChange}
          onFocus={onFocus}
          placeholder="0"
          placeholderTextColor={colors.placeholder}
        />
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  currencySelector: { flexDirection: 'row', alignItems: 'center', width: 110 },
  flag: { fontSize: 28, marginRight: 8 },
  code: { fontSize: 18, fontWeight: '600' },
  input: {
    flex: 1,
    fontSize: 20,
    padding: 8,
    borderBottomWidth: 1,
    textAlign: 'right',
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    borderRadius: 12,
    marginBottom: 12,
    marginLeft: 8,
  },
  deleteText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default CurrencyRow;
