import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAppColors } from '../theme';

import { CurrencyItem } from '../utils/currencyList';


interface Props {
  navigation: any;
  route: {
    params: {
      currencies: CurrencyItem[];
      onSelect: (currencyCode: string, flag: string) => void;
    };
  };
}

const CurrencyPickerScreen: React.FC<Props> = ({ navigation, route }) => {
  const colors = useAppColors();
  const [search, setSearch] = useState('');
  const { onSelect, currencies } = route.params;

  const query = search.toLowerCase();
  const filtered = currencies.filter(c =>
    c.code.toLowerCase().includes(query) ||
    c.name.toLowerCase().includes(query) ||
    c.keywords.includes(query)
  );

  const selectCurrency = (code: string, flag: string) => {
    onSelect(code, flag);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        style={[styles.searchInput, { borderColor: colors.inputBorder, backgroundColor: colors.card, color: colors.text }]}
        placeholder="Поиск (USD, рубль, Россия, Japan...)"
        placeholderTextColor={colors.placeholder}
        value={search}
        onChangeText={setSearch}
        autoFocus
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, { borderBottomColor: colors.border }]}
            onPress={() => selectCurrency(item.code, item.flag)}
          >
            <Text style={styles.flag}>{item.flag}</Text>
            <View style={styles.textContainer}>
              <Text style={[styles.code, { color: colors.text }]}>{item.code}</Text>
              <Text style={[styles.name, { color: colors.textSecondary }]} numberOfLines={1}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  flag: { fontSize: 28, marginRight: 12 },
  textContainer: { flex: 1 },
  code: { fontSize: 18, fontWeight: '600' },
  name: { fontSize: 13, marginTop: 2 },
});

export default CurrencyPickerScreen;
