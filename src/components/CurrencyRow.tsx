import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
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
  onDragStart?: () => void;
  onDragEnd?: (distanceY: number) => void;
  isDragging?: boolean;
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
  onDragStart,
  onDragEnd,
  isDragging,
}) => {
  const { t } = useTranslation();
  const swipeableRef = useRef<Swipeable>(null);
  const translateY = useRef(new Animated.Value(0)).current;

  const resetDragPosition = () => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => Boolean(onDragEnd),
      onMoveShouldSetPanResponder: (_event, gestureState) =>
        Boolean(onDragEnd) && Math.abs(gestureState.dy) > 4,
      onPanResponderGrant: () => {
        swipeableRef.current?.close();
        onDragStart?.();
      },
      onPanResponderMove: (_event, gestureState) => {
        translateY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_event, gestureState) => {
        onDragEnd?.(gestureState.dy);
        resetDragPosition();
      },
      onPanResponderTerminate: resetDragPosition,
    }),
  ).current;

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
        style={[styles.deleteAction, { backgroundColor: colors.danger }]}
        onPress={() => {
          swipeableRef.current?.close();
          onDelete?.();
        }}
      >
        <Animated.Text style={[styles.deleteText, { transform: [{ scale }] }]}>
          {t('common.delete')}
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View
      style={[
        styles.dragContainer,
        isDragging && styles.dragging,
        { transform: [{ translateY }] },
      ]}
    >
      <Swipeable
        ref={swipeableRef}
        enabled={!isDragging}
        renderRightActions={onDelete ? renderRightActions : undefined}
        overshootRight={false}
        friction={2}
      >
        <View
          style={[
            styles.row,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <TouchableOpacity onPress={onPressCurrency} style={styles.currencySelector}>
            <Text style={styles.flag}>{flag}</Text>
            <Text style={[styles.code, { color: colors.textPrimary }]}>{currencyCode}</Text>
          </TouchableOpacity>
          <TextInput
            style={[
              styles.input,
              {
                color: colors.textPrimary,
                borderBottomColor: colors.border,
              },
            ]}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={onAmountChange}
            onFocus={onFocus}
            placeholder="0"
            placeholderTextColor={colors.placeholder}
          />
          <View
            accessibilityRole="adjustable"
            accessibilityLabel={t('main.dragA11y', { code: currencyCode })}
            style={styles.dragHandle}
            {...panResponder.panHandlers}
          >
            <Text style={[styles.dragHandleText, { color: colors.textSecondary }]}>☰</Text>
          </View>
        </View>
      </Swipeable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  dragContainer: {
    zIndex: 0,
  },
  dragging: {
    elevation: 8,
    opacity: 0.96,
    zIndex: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
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
  dragHandle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    minHeight: 44,
    width: 32,
  },
  dragHandleText: {
    fontSize: 22,
    fontWeight: '700',
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
