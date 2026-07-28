import React, { useCallback, useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Keyboard,
  Animated,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import CurrencyRow from '../components/CurrencyRow';
import { loadRates } from '../services/CurrencyService';
import { buildCurrencyList } from '../utils/currencyList';
import { formatConvertedAmount } from '../utils/convertedAmountFormat';
import { useAppTheme } from '../theme';

function formatAmount(value: string): string {
  if (!value) return '';
  const parts = value.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return parts.join('.');
}

function normalizeDecimalInput(value: string): string {
  let normalized = '';
  let hasSeparator = false;

  for (const char of value.replace(/\s/g, '').replace(',', '.')) {
    if (/\d/.test(char)) {
      normalized += char;
      continue;
    }
    if (char === '.' && !hasSeparator) {
      normalized += char;
      hasSeparator = true;
    }
  }

  return normalized;
}

function convertAmount(
  amount: number,
  fromCode: string,
  toCode: string,
  rates: Record<string, number>,
): string {
  const fromRate = rates[fromCode] || 1;
  const toRate = rates[toCode] || 1;
  const converted = (amount / fromRate) * toRate;
  return formatConvertedAmount(converted, toCode);
}

const STORAGE_ROWS_KEY = 'currency_rows';
const MAX_ROWS = 10;
const ROW_DRAG_STEP = 76;

type CurrencyRowData = {
  id: string;
  code: string;
  flag: string;
  amount: string;
};

const MainScreen = ({ navigation }: any) => {
  const { colors } = useAppTheme();
  const { t, i18n } = useTranslation();

  const renderHeaderRight = useCallback(() => (
    <View style={styles.headerActions}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Settings')}
        style={[styles.headerButton, { borderColor: colors.border, backgroundColor: colors.card }]}
        accessibilityRole="button"
        accessibilityLabel={t('main.settingsA11y')}
      >
        <Text style={[styles.headerButtonText, { color: colors.textPrimary }]}>⚙️</Text>
      </TouchableOpacity>
    </View>
  ), [navigation, colors.border, colors.card, colors.textPrimary, t]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: renderHeaderRight,
    });
  }, [navigation, renderHeaderRight]);
  const [rows, setRows] = useState<CurrencyRowData[]>([]);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [draggingRowId, setDraggingRowId] = useState<string | null>(null);

  const keyboardHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = Keyboard.addListener(showEvent, (e) => {
      const extraOffset = Platform.OS === 'android' ? 48 : 0;
      Animated.timing(keyboardHeight, {
        toValue: e.endCoordinates.height + extraOffset,
        duration: Platform.OS === 'ios' ? e.duration : 200,
        useNativeDriver: false,
      }).start();
    });

    const onHide = Keyboard.addListener(hideEvent, () => {
      Animated.timing(keyboardHeight, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
      setActiveRowId(null);
    });

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, [keyboardHeight]);

  useEffect(() => {
    const init = async () => {
      const freshRates = await loadRates((newRates) => {
        setRates(newRates);
        recalcAllAmounts(newRates);
      });
      setRates(freshRates);

      const stored = await AsyncStorage.getItem(STORAGE_ROWS_KEY);
      if (stored) {
        setRows(JSON.parse(stored));
      } else {
        const defaultRows = [
          { id: Date.now().toString(), code: 'USD', flag: '🇺🇸', amount: '0' },
          { id: (Date.now() + 1).toString(), code: 'EUR', flag: '🇪🇺', amount: '0' },
          { id: (Date.now() + 2).toString(), code: 'GBP', flag: '🇬🇧', amount: '0' },
        ];
        setRows(defaultRows);
        await AsyncStorage.setItem(STORAGE_ROWS_KEY, JSON.stringify(defaultRows));
      }
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (rows.length > 0) {
      AsyncStorage.setItem(STORAGE_ROWS_KEY, JSON.stringify(rows));
    }
  }, [rows]);

  const recalcAllAmounts = (currentRates: Record<string, number>, changedRowId?: string, newAmount?: number) => {
    if (Object.keys(currentRates).length === 0) return;

    setRows(prev => {
      const baseRow = prev.find(r => r.id === changedRowId);
      if (!baseRow && changedRowId) return prev;
      if (!baseRow) return prev;

      const baseCurrency = baseRow.code;
      const baseAmount = newAmount ?? 0;

      const baseRateToUSD = currentRates[baseCurrency] || 1;
      const amountInUSD = baseAmount / baseRateToUSD;

      return prev.map(row => {
        if (row.id === changedRowId) {
          return { ...row, amount: baseAmount.toString() };
        }
        const rate = currentRates[row.code] || 1;
        return {
          ...row,
          amount: formatConvertedAmount(amountInUSD * rate, row.code),
        };
      });
    });
  };

  const handleAmountChange = (id: string, text: string) => {
    const raw = normalizeDecimalInput(text);
    const num = parseFloat(raw);
    const value = isNaN(num) ? 0 : num;

    setRows(prev => {
      if (Object.keys(rates).length === 0) {
        return prev.map(row => row.id === id ? { ...row, amount: raw } : row);
      }

      const baseRow = prev.find(r => r.id === id);
      if (!baseRow) return prev;

      const baseRateToUSD = rates[baseRow.code] || 1;
      const amountInUSD = value / baseRateToUSD;

      return prev.map(row => {
        if (row.id === id) {
          return { ...row, amount: raw };
        }
        const rate = rates[row.code] || 1;
        return {
          ...row,
          amount: formatConvertedAmount(amountInUSD * rate, row.code),
        };
      });
    });
  };

  const handleDeleteRow = (rowId: string) => {
    setRows(prev => prev.filter(r => r.id !== rowId));
  };

  const handleDragStart = (rowId: string) => {
    Keyboard.dismiss();
    setActiveRowId(null);
    setDraggingRowId(rowId);
  };

  const handleDragEnd = (rowId: string, distanceY: number) => {
    setDraggingRowId(null);

    const offset = Math.round(distanceY / ROW_DRAG_STEP);
    if (offset === 0) {
      return;
    }

    setRows(prev => {
      const fromIndex = prev.findIndex(row => row.id === rowId);
      if (fromIndex < 0) {
        return prev;
      }

      const toIndex = Math.max(0, Math.min(prev.length - 1, fromIndex + offset));
      if (toIndex === fromIndex) {
        return prev;
      }

      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const handleOpenCurrencyPicker = (rowId: string) => {
    const currencies = buildCurrencyList(Object.keys(rates), i18n.language);
    navigation.navigate('CurrencyPicker', {
      currencies,
      onSelect: (code: string, flag: string) => {
        setRows(prev => prev.map(row => {
          if (row.id !== rowId) return row;
          const amount = Object.keys(rates).length === 0
            ? row.amount
            : convertAmount(parseFloat(row.amount) || 0, row.code, code, rates);
          return { ...row, code, flag, amount };
        }));
      },
    });
  };

  const handleOpenCalculator = () => {
    if (!activeRowId) return;
    const rowId = activeRowId;
    Keyboard.dismiss();
    navigation.navigate('Calculator', {
      onResult: (value: string) => {
        handleAmountChange(rowId, value);
      },
    });
  };

  const addNewCurrency = () => {
    if (rows.length >= MAX_ROWS) {
      Alert.alert(
        t('main.limitTitle'),
        t('main.limitMessage', { max: MAX_ROWS }),
      );
      return;
    }
    const currencies = buildCurrencyList(Object.keys(rates), i18n.language);
    navigation.navigate('CurrencyPicker', {
      currencies,
      onSelect: (code: string, flag: string) => {
        setRows(prev => {
          const refRow = prev.find(row => (parseFloat(row.amount) || 0) !== 0) ?? prev[0];
          const amount = !refRow || Object.keys(rates).length === 0
            ? '0'
            : convertAmount(parseFloat(refRow.amount) || 0, refRow.code, code, rates);

          return [
            ...prev,
            {
              id: Date.now().toString(),
              code,
              flag,
              amount,
            },
          ];
        });
      },
    });
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        style={[styles.loader, { backgroundColor: colors.background }]}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid
        enableResetScrollToCoords={false}
        extraScrollHeight={28}
        extraHeight={56}
        keyboardOpeningTime={Platform.OS === 'android' ? 100 : undefined}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        {rows.map(row => (
          <CurrencyRow
            key={row.id}
            flag={row.flag}
            currencyCode={row.code}
            amount={formatAmount(row.amount)}
            colors={colors}
            onPressCurrency={() => handleOpenCurrencyPicker(row.id)}
            onAmountChange={(text) => handleAmountChange(row.id, text)}
            onFocus={() => setActiveRowId(row.id)}
            onDelete={() => handleDeleteRow(row.id)}
            onDragStart={rows.length > 1 ? () => handleDragStart(row.id) : undefined}
            onDragEnd={rows.length > 1 ? (distanceY) => handleDragEnd(row.id, distanceY) : undefined}
            isDragging={draggingRowId === row.id}
          />
        ))}
        {rows.length < MAX_ROWS && (
          <TouchableOpacity
            style={[
              styles.addButton,
              {
                backgroundColor: colors.chipInactiveBg,
                borderColor: colors.border,
              },
            ]}
            onPress={addNewCurrency}
          >
            <Text style={[styles.addText, { color: colors.textPrimary }]}>
              {t('main.addCurrency')}
            </Text>
          </TouchableOpacity>
        )}
      </KeyboardAwareScrollView>

      {activeRowId && (
        <Animated.View style={[styles.toolbar, { bottom: keyboardHeight, backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.toolbarButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handleOpenCalculator}
          >
            <Text style={[styles.toolbarButtonText, { color: colors.textPrimary }]}>
              {t('main.calculator')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toolbarDone}
            onPress={() => Keyboard.dismiss()}
          >
            <Text style={[styles.toolbarDoneText, { color: colors.accent }]}>
              {t('common.done')}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loader: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 96 },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  headerButton: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  headerButtonText: { fontSize: 18, fontWeight: '700' },
  addButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  addText: { fontSize: 16, fontWeight: '600' },
  toolbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  toolbarButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  toolbarButtonText: { fontSize: 16, fontWeight: '500' },
  toolbarDone: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  toolbarDoneText: { fontSize: 16, fontWeight: '600' },
});

export default MainScreen;
