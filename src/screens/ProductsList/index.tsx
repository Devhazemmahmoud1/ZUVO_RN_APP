// ProductsList.tsx
import React, { useMemo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ArrowLeftIcon from '../../icons/arrowBack';
import { SearchIcon } from '../../icons/SearchIcon';
import ListIcon from '../../icons/ListIcon';
import SquaresIcon from '../../icons/Squares';
import Products from './components/Products'; // <-- NEW: a single-card component
import FilterPlusIcon from '../../icons/Filter';
import SortingIcon from '../../icons/Sorting';
import SortingModel from './components/SortingModel';
import FilterModal from './components/FilterModel';
import { getCairoFont } from '../../ultis/getFont';
import { useProductsInfinite } from '../../apis/getProductsPaginated';
import LoadingSpinner from '../../components/Loading';
import { useAuth } from '../../AuthContext';
import { useLanguage } from '../../LanguageProvider';
import ProductListSkeleton, {
  ProductListNextPageSkeleton,
} from '../../components/ProductsSkeletons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const OUTER_PADDING = 8; // matches contentContainerStyle padding
const COLUMN_GAP = 10; // matches columnWrapperStyle marginBottom
const CARD_WIDTH = (SCREEN_WIDTH - OUTER_PADDING * 2 - COLUMN_GAP) / 2;

export default function ProductsList({ route }) {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [currentLayout, setCurrentLayout] = React.useState<'row' | 'column'>(
    'row',
  );
  const [visibility, setVisibility] = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const { isRTL } = useLanguage();

  const screenParams = route?.params?.params ?? {};
  const selectedSubCategoryId = screenParams.subCategoryId;

  const [selectedValues, setSelectedValues] = React.useState<any>([
    {
      car_brand: [],
      product_brand: [],
      category: screenParams.categoryId,
      price: [],
      item_condition: [],
    },
  ]);

  const params = useMemo(() => {
    const s = selectedValues[0] ?? {};
    return {
      categoryId: s.category ?? '',
      subCategoryId:
        selectedSubCategoryId !== undefined && selectedSubCategoryId !== null
          ? [selectedSubCategoryId]
          : undefined,
      brandId: s.product_brand ?? [],
      make: s.car_brand ?? [],
      minPrice: Number.isFinite(s?.price?.[0]) ? s.price[0] : undefined,
      maxPrice: Number.isFinite(s?.price?.[1]) ? s.price[1] : undefined,
      condition: s.item_condition ?? [],
      sortBy: 'newest',
      limit: 20,
      search: search || '',
    };
  }, [selectedValues, search, selectedSubCategoryId]);

  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch,
  } = useProductsInfinite(params as any);

  const pageSize = params.limit ?? 20;

  const items = useMemo(
    () => (data?.pages ?? []).flatMap((p: any) => p?.data ?? []),
    [data],
  );

  const onEnd = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  const rightIconPress = () =>
    setCurrentLayout(currentLayout === 'column' ? 'row' : 'column');

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top bar */}
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.padding}
        >
          <ArrowLeftIcon size={30} color="black" />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <View style={styles.searchIcon}>
            <SearchIcon size={20} color="grey" />
          </View>
          <TextInput
            placeholder="Search products"
            style={[styles.searchField, getCairoFont('500')]}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={() => refetch()}
            returnKeyType="search"
          />
        </View>

        <TouchableOpacity onPress={rightIconPress} style={styles.padding}>
          {currentLayout === 'row' ? (
            <ListIcon size={24} color="black" />
          ) : (
            <SquaresIcon size={24} color="black" />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>
        {isRTL ? screenParams.subCategoryName_ar : screenParams.subCategoryName_en}{' '}
      </Text>

      {/* Soft gray background restored */}
      <View style={{ flex: 1, backgroundColor: '#f2f2f2', paddingTop: 0 }}>
        <FlatList
          contentContainerStyle={{
            padding: OUTER_PADDING,
            paddingBottom: 120,
          }}
          data={items}
          key={currentLayout}
          keyExtractor={item => String(item.id)}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: COLUMN_GAP,
          }}
          renderItem={({ item }) => (
            <Products
              item={item}
              layout={currentLayout}
              cardWidth={CARD_WIDTH}
              user={user}
            />
          )}
          onEndReached={onEnd}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            isFetchingNextPage && items.length > 0 ? (
              <ProductListNextPageSkeleton count={pageSize} />
            ) : null
          }
          ListEmptyComponent={isLoading ? ProductListSkeleton : null}
        />
      </View>

      {/* Sort/Filter */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.bottomButton, styles.leftButton]}
          onPress={() => setVisibility(true)}
        >
          <View style={styles.iconTextRow}>
            <SortingIcon color="#fff" />
            <Text style={styles.bottomButtonText}>Sort</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bottomButton, styles.rightButton]}
          onPress={() => setFilterOpen(true)}
        >
          <View style={styles.iconTextRow}>
            <FilterPlusIcon color="#fff" />
            <Text style={styles.bottomButtonText}>Filter</Text>
          </View>
        </TouchableOpacity>
      </View>

      {isFetching && items.length > 0 && <LoadingSpinner overlay />}

      {visibility && (
        <SortingModel
          visible={visibility}
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
          onClose={() => setVisibility(false)}
        />
      )}
      {filterOpen && (
        <FilterModal
          visible={filterOpen}
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
          onClose={() => setFilterOpen(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#f1f1f1',
    borderWidth: 2,
    borderRadius: 8,
    marginHorizontal: 10,
    paddingHorizontal: 8,
  },
  searchField: { flex: 1, height: 40 },
  padding: { padding: 6 },
  searchIcon: { padding: 6, marginRight: 2 },
  bottomBar: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d578f',
    paddingHorizontal: 12,
    paddingVertical: 7,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  leftButton: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderColor: '#fff',
    borderRightWidth: 1,
  },
  rightButton: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderColor: '#fff',
    borderLeftWidth: 1,
  },
  iconTextRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  bottomButtonText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  sectionTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
});
