import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, Image, Dimensions, ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../theme';
import { apiClient } from '../../services/api/client';
import { Product } from '../../types';
import { storage } from '../../utils/storage';

const { width } = Dimensions.get('window');
const CARD_W = (width - Spacing.lg * 2 - Spacing.md) / 2;

type Props = {
  navigation: NativeStackNavigationProp<SearchStackParamList, 'SearchScreen'>;
};

const SORT_OPTIONS = [
  { label: 'Relevance', value: '' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Top Rated', value: 'rating' },
];

const PRICE_RANGES = [
  { label: 'All', min: 0, max: 0 },
  { label: 'Under ₹10k', min: 0, max: 10000 },
  { label: '₹10k–₹50k', min: 10000, max: 50000 },
  { label: '₹50k–₹1L', min: 50000, max: 100000 },
  { label: 'Above ₹1L', min: 100000, max: 0 },
];

// ── History helpers ──────────────────────────────────────────────────────────
const HISTORY_KEY = 'search_history';
const getHistory = (): string[] => {
  try {
    return JSON.parse(storage.getString(HISTORY_KEY) ?? '[]');
  } catch { return []; }
};
const saveHistory = (term: string) => {
  const h = getHistory().filter(i => i !== term).slice(0, 9);
  storage.set(HISTORY_KEY, JSON.stringify([term, ...h]));
};
const clearHistory = () => storage.delete(HISTORY_KEY);

// ── Product Card ─────────────────────────────────────────────────────────────
function SearchCard({ product, onPress }: { product: Product; onPress: () => void }) {
  return (
    <TouchableOpacity style={cardStyles.container} onPress={onPress} activeOpacity={0.85}>
      <View style={cardStyles.imageBox}>
        {product.images?.[0] ? (
          <Image source={{ uri: product.images[0] }} style={cardStyles.image} />
        ) : (
          <View style={cardStyles.placeholder}>
            <Text style={{ fontSize: 36 }}>⌚</Text>
          </View>
        )}
        {product.discountPrice && (
          <View style={cardStyles.badge}>
            <Text style={cardStyles.badgeText}>
              -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
            </Text>
          </View>
        )}
      </View>
      <View style={cardStyles.info}>
        <Text style={cardStyles.brand} numberOfLines={1}>{product.brand}</Text>
        <Text style={cardStyles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={cardStyles.price}>
          ₹{(product.discountPrice ?? product.price).toLocaleString()}
        </Text>
        <View style={cardStyles.ratingRow}>
          <Text style={cardStyles.star}>★</Text>
          <Text style={cardStyles.rating}>{product.ratings.toFixed(1)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Filter Sheet ─────────────────────────────────────────────────────────────
function FilterSheet({
  sort, setSort, priceRange, setPriceRange, onApply,
}: {
  sort: string;
  setSort: (v: string) => void;
  priceRange: number;
  setPriceRange: (v: number) => void;
  onApply: () => void;
}) {
  return (
    <View style={filterStyles.container}>
      <Text style={filterStyles.heading}>Sort By</Text>
      {SORT_OPTIONS.map(opt => (
        <TouchableOpacity
          key={opt.value}
          style={filterStyles.option}
          onPress={() => setSort(opt.value)}>
          <View style={[filterStyles.radio, sort === opt.value && filterStyles.radioActive]} />
          <Text style={filterStyles.optionText}>{opt.label}</Text>
        </TouchableOpacity>
      ))}

      <Text style={[filterStyles.heading, { marginTop: Spacing.lg }]}>Price Range</Text>
      {PRICE_RANGES.map((r, i) => (
        <TouchableOpacity
          key={i}
          style={filterStyles.option}
          onPress={() => setPriceRange(i)}>
          <View style={[filterStyles.radio, priceRange === i && filterStyles.radioActive]} />
          <Text style={filterStyles.optionText}>{r.label}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={filterStyles.applyBtn} onPress={onApply}>
        <Text style={filterStyles.applyText}>APPLY FILTERS</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Main Screen ──────────────────────────────────────────────────────────────
export default function SearchScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState('');
  const [priceRange, setPriceRange] = useState(0);
  const [history, setHistory] = useState<string[]>(getHistory);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleQueryChange = useCallback((text: string) => {
    setQuery(text);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(text);
    }, 400);
  }, []);

  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    saveHistory(term.trim());
    setHistory(getHistory());
    setQuery(term);
    setDebouncedQuery(term);
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  const buildParams = () => {
    const params: Record<string, string | number> = { keyword: debouncedQuery };
    if (sort) params.sort = sort;
    const range = PRICE_RANGES[priceRange];
    if (range.min) params.minPrice = range.min;
    if (range.max) params.maxPrice = range.max;
    return params;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery, sort, priceRange],
    queryFn: () =>
      apiClient.get('/products', { params: buildParams() }).then(r => r.data),
    enabled: debouncedQuery.length > 1,
  });

  const products: Product[] = data?.products ?? [];
  const showEmpty = debouncedQuery.length > 1 && !isLoading && products.length === 0;
  const showResults = debouncedQuery.length > 1;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={handleQueryChange}
          onSubmitEditing={() => handleSearch(query)}
          placeholder="Search watches, brands..."
          placeholderTextColor={Colors.text.muted}
          autoFocus
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setDebouncedQuery(''); }}>
            <Text style={styles.clear}>✕</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.filterBtn, showFilters && styles.filterBtnActive]}
          onPress={() => setShowFilters(f => !f)}>
          <Text style={styles.filterIcon}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* Active Filters Chips */}
      {(sort || priceRange > 0) && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {sort && (
            <View style={styles.chip}>
              <Text style={styles.chipText}>
                {SORT_OPTIONS.find(o => o.value === sort)?.label}
              </Text>
              <TouchableOpacity onPress={() => setSort('')}>
                <Text style={styles.chipRemove}> ✕</Text>
              </TouchableOpacity>
            </View>
          )}
          {priceRange > 0 && (
            <View style={styles.chip}>
              <Text style={styles.chipText}>{PRICE_RANGES[priceRange].label}</Text>
              <TouchableOpacity onPress={() => setPriceRange(0)}>
                <Text style={styles.chipRemove}> ✕</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      {/* Filter Sheet */}
      {showFilters && (
        <FilterSheet
          sort={sort}
          setSort={setSort}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          onApply={() => setShowFilters(false)}
        />
      )}

      {/* Results Count */}
      {showResults && !isLoading && products.length > 0 && (
        <Text style={styles.resultCount}>
          {products.length} results for "{debouncedQuery}"
        </Text>
      )}

      {/* Loading */}
      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}

      {/* Empty */}
      {showEmpty && (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptyText}>
            Try searching with different keywords
          </Text>
        </View>
      )}

      {/* Search History */}
      {!showResults && history.length > 0 && (
        <View style={styles.historyBox}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Recent Searches</Text>
            <TouchableOpacity onPress={handleClearHistory}>
              <Text style={styles.clearHistory}>Clear All</Text>
            </TouchableOpacity>
          </View>
          {history.map((term, i) => (
            <TouchableOpacity
              key={i}
              style={styles.historyItem}
              onPress={() => handleSearch(term)}>
              <Text style={styles.historyIcon}>🕐</Text>
              <Text style={styles.historyText}>{term}</Text>
              <Text style={styles.historyArrow}>↗</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Suggestions when empty query */}
      {!showResults && history.length === 0 && (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>⌚</Text>
          <Text style={styles.emptyTitle}>Find Your Perfect Watch</Text>
          <Text style={styles.emptyText}>
            Search by name, brand, or style
          </Text>
          <View style={styles.suggestRow}>
            {['Rolex', 'Omega', 'Casio', 'Titan'].map(s => (
              <TouchableOpacity
                key={s}
                style={styles.suggestChip}
                onPress={() => handleSearch(s)}>
                <Text style={styles.suggestText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Results Grid */}
      {showResults && !isLoading && products.length > 0 && (
        <FlatList
          data={products}
          keyExtractor={item => item._id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <SearchCard
              product={item}
              onPress={() =>
                navigation.navigate('ProductDetail', { productId: item._id })
              }
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    backgroundColor: Colors.white, gap: 10,
    borderBottomWidth: 1, borderColor: Colors.border,
  },
  back: { fontSize: 22, color: Colors.black },
  input: {
    flex: 1, ...Typography.body1, color: Colors.black,
    backgroundColor: Colors.background, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  clear: { fontSize: 16, color: Colors.text.muted, paddingHorizontal: 4 },
  filterBtn: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  filterBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterIcon: { fontSize: 16 },
  chips: { paddingHorizontal: Spacing.lg, paddingVertical: 8, gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.primary + '15', borderRadius: 100,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: Colors.primary + '40',
  },
  chipText: { ...Typography.caption, color: Colors.primary, fontWeight: '600' },
  chipRemove: { ...Typography.caption, color: Colors.primary },
  resultCount: {
    ...Typography.body2, color: Colors.text.secondary,
    paddingHorizontal: Spacing.lg, paddingVertical: 10,
  },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { ...Typography.h4, color: Colors.black, marginBottom: 8 },
  emptyText: { ...Typography.body2, color: Colors.text.secondary, textAlign: 'center' },
  suggestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 24, justifyContent: 'center' },
  suggestChip: {
    paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: Colors.white, borderRadius: 100,
    borderWidth: 1, borderColor: Colors.border,
  },
  suggestText: { ...Typography.body2, color: Colors.black, fontWeight: '600' },
  historyBox: { padding: Spacing.lg },
  historyHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: Spacing.md,
  },
  historyTitle: { ...Typography.h5, color: Colors.black },
  clearHistory: { ...Typography.body2, color: Colors.primary },
  historyItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderColor: Colors.border,
    gap: 12,
  },
  historyIcon: { fontSize: 16 },
  historyText: { ...Typography.body1, color: Colors.black, flex: 1 },
  historyArrow: { fontSize: 16, color: Colors.text.muted },
  row: { gap: Spacing.md },
  list: { padding: Spacing.lg, gap: Spacing.md },
});

const cardStyles = StyleSheet.create({
  container: {
    width: CARD_W, backgroundColor: Colors.white,
    borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  imageBox: { width: '100%', aspectRatio: 1, backgroundColor: Colors.background },
  image: { width: '100%', height: '100%' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: Colors.error, borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  badgeText: { ...Typography.caption, color: Colors.white, fontWeight: '700' },
  info: { padding: 10 },
  brand: { ...Typography.caption, color: Colors.primary, letterSpacing: 1, marginBottom: 2 },
  name: { ...Typography.body2, color: Colors.black, fontWeight: '600', marginBottom: 6 },
  price: { ...Typography.h5, color: Colors.black, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  star: { color: '#F4A261', fontSize: 12 },
  rating: { ...Typography.caption, color: Colors.black, fontWeight: '600' },
});

const filterStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white, margin: Spacing.lg,
    borderRadius: 20, padding: Spacing.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 16, elevation: 8,
  },
  heading: { ...Typography.h5, color: Colors.black, marginBottom: 12 },
  option: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, gap: 12,
  },
  radio: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: Colors.border,
  },
  radioActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  optionText: { ...Typography.body1, color: Colors.black },
  applyBtn: {
    backgroundColor: Colors.primary, borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginTop: Spacing.lg,
  },
  applyText: { ...Typography.button, color: Colors.white, letterSpacing: 1.5 },
});