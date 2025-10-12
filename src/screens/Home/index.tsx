import { Animated, StyleSheet, View, ActivityIndicator, Platform } from 'react-native';
import BannerCarousel from './component/BannerCarosuel';
import HomeHeader from './component/Header';
import CategoriesPager from './component/CategoryPager';
import RecommendedForYou, { Product as RecommendedProduct } from './component/Recomended';
import PerviouslyBrowsered from './component/PerviouslyBrowsered';
import BestDealForYou from './component/BestDealsForYou';
import ShopByBrand from '../ProductsList/components/ShopByBrand';
import AddressSwitcher from './component/AddressesSwitcher';
import HomeSkeleton from './component/HomeSkeleton';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useWishlist } from '../../apis/wishlistApi';
import { useAddressContext } from '../../AddressProvider';
import { useQuery } from '@tanstack/react-query';
import { handleGetCategories } from '../../apis/handleGetCategories';
import { useGetProducts } from '../../apis/getProducts';
import { useLanguage } from '../../LanguageProvider';

const banner1 = require('../../assets/banner_1.webp');
const banner2 = require('../../assets/banner_2.webp');
const banner3 = require('../../assets/banner_3.webp');
const banner4 = require('../../assets/banner_4.jpg');

export const BANNERS: any[] = [
  { id: '1', title: 'Baby Sale', color: 'red', img: banner1 },
  { id: '2', title: 'Up to 70% off', color: 'blue', img: banner2 },
  { id: '3', title: 'New Arrivals', color: 'green', img: banner3 },
  { id: '1', title: 'Baby Sale', color: 'red', img: banner4 },
];

export const CATEGORIES: any[] = [
  { id: '1', label: 'Mobiles', img: require('../../assets/spark.png') },
  {
    id: '2',
    label: 'Home & Kitchen',
    img: require('../../assets/main_logo.png'),
  },
  { id: '3', label: 'Shop Mahali', img: require('../../assets/main_logo.png') },
  {
    id: '4',
    label: 'Home Appliances',
    img: require('../../assets/main_logo.png'),
  },
  { id: '5', label: 'Toys', img: require('../../assets/main_logo.png') },
  { id: '6', label: 'Ganesh Chaturthi', icon: 'flower-outline' },
  { id: '7', label: 'Home Services', icon: 'construct-outline' },
  { id: '8', label: 'Men’s Fashion', icon: 'shirt-outline' },
  { id: '9', label: 'Summer', icon: 'sunny-outline' },
  { id: '10', label: 'Sports', icon: 'bicycle-outline' },
  { id: '11', label: 'Beauty', icon: 'color-palette-outline' },
  { id: '12', label: 'Gaming', icon: 'game-controller-outline' },
];

export const RECOMMENDED: RecommendedProduct[] = [
  {
    id: 'p1',
    title: 'Apple iPhone 16 Pro Max 256GB...',
    bg: '#F3EDE8',
    rating: 4.6,
    ratingCount: 25500,
    price: 3999,
    oldPrice: 5099,
    bestSeller: true,
    tagline: 'Lowest price in a...',
    express: true,
    img: require('../../assets/spark.png'),
  },
  {
    id: 'p2',
    title: 'Apple New 2025 MacBook Air M4...',
    bg: '#E8F2FF',
    rating: 4.6,
    ratingCount: 571,
    price: 3199,
    oldPrice: 5239,
    tagline: 'Selling out fast',
    express: true,
    img: require('../../assets/spark.png'),
  },
  {
    id: 'p3',
    title: 'Apple iPhone 16 Pro Max 256GB...',
    bg: '#EFEFEF',
    rating: 4.6,
    ratingCount: 25500,
    price: 4665,
    oldPrice: 5299,
    express: true,
    img: require('../../assets/spark.png'),
  },
];

const Home = () => {
  const [openAddressSwitcher, setOpenAddressSwitcher] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const { isLoading: addressesLoading } = useAddressContext();
  const { data: wishlist, isPending: wishlistPending } = useWishlist();
  const { data: categoriesData, isPending: categoriesPending } = useQuery({
    queryKey: ['home', 'categories'],
    queryFn: handleGetCategories,
    staleTime: 5 * 60 * 1000,
  });
  const { data: productsResponse, isPending: productsPending } = useGetProducts({
    limit: 18,
    sortBy: 'popular',
  });
  const { isRTL } = useLanguage();

  const products = useMemo(() => productsResponse?.data ?? [], [productsResponse]);

  const mapProductToCard = useCallback(
    (product: any): RecommendedProduct => {
      const discountPct = product?.discount?.percentage ?? 0;
      const title = isRTL
        ? product?.name_ar ?? product?.name_en ?? product?.sku ?? 'Product'
        : product?.name_en ?? product?.name_ar ?? product?.sku ?? 'Product';
      const image = product?.images?.[0]?.url
        ? { uri: product.images[0].url }
        : undefined;
      const priceAfterDiscount = product?.priceAfterDiscount ?? product?.price ?? 0;
      const originalPrice = product?.priceAfterDiscount ? product?.price : undefined;

      return {
        id: String(product?.id ?? product?.productId ?? title),
        title,
        img: image,
        rating: product?.review?.avg ?? 0,
        ratingCount: product?.reviewCount ?? 0,
        price: priceAfterDiscount,
        oldPrice: originalPrice,
        tagline: product?.vendor?.businessName ?? undefined,
        bestSeller: discountPct >= 25,
        express: Boolean(product?.freeDelivery),
      };
    },
    [isRTL],
  );

  const recommendedItems = useMemo(() => {
    if (!products.length) return RECOMMENDED;
    const slice = products.slice(0, 6).map(mapProductToCard);
    return slice.length ? slice : RECOMMENDED;
  }, [mapProductToCard, products]);

  const bestDealsItems = useMemo(() => {
    if (!products.length) return RECOMMENDED;
    const sorted = [...products].sort(
      (a, b) => (b?.discount?.percentage ?? 0) - (a?.discount?.percentage ?? 0),
    );
    const slice = sorted.slice(0, 6).map(mapProductToCard);
    return slice.length ? slice : RECOMMENDED;
  }, [mapProductToCard, products]);

  const previouslyBrowsedItems = useMemo(() => {
    if (!products.length) return RECOMMENDED;
    const sorted = [...products].sort((a, b) => {
      const aDate = new Date(a?.updatedAt ?? a?.createdAt ?? 0).getTime();
      const bDate = new Date(b?.updatedAt ?? b?.createdAt ?? 0).getTime();
      return bDate - aDate;
    });
    const slice = sorted.slice(0, 6).map(mapProductToCard);
    return slice.length ? slice : RECOMMENDED;
  }, [mapProductToCard, products]);

  const categoriesItems = useMemo(() => {
    if (!Array.isArray(categoriesData) || categoriesData.length === 0) {
      return CATEGORIES;
    }

    return categoriesData.slice(0, 8).map((cat: any) => ({
      id: String(cat?.id ?? cat?.categoryId ?? Math.random()),
      label: isRTL
        ? cat?.name_ar ?? cat?.name_en ?? ''
        : cat?.name_en ?? cat?.name_ar ?? '',
      img: cat?.image,
    }));
  }, [categoriesData, isRTL]);

  const wishlistCount = wishlist?.count ?? 0;
  const showSkeleton = wishlistPending || addressesLoading || categoriesPending || productsPending;

  // Android: show plain white overlay with tomato spinner that fades out on data ready
  const isAndroid = Platform.OS === 'android';
  const [overlayVisible, setOverlayVisible] = useState<boolean>(isAndroid && showSkeleton);
  const overlayOpacity = useRef(new Animated.Value(1)).current;

  if (isAndroid) {
    if (showSkeleton && !overlayVisible) {
      // data loading started again; show overlay immediately
      setOverlayVisible(true);
      overlayOpacity.setValue(1);
    }
  }

  // When loading finishes on Android, fade the overlay out smoothly
  if (isAndroid && overlayVisible && !showSkeleton) {
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(() => setOverlayVisible(false));
  }

  const cancelModel = () => setOpenAddressSwitcher(false);

  return (
    <View style={styles.screen}>
      {/* iOS keeps skeleton; Android shows spinner overlay */}
      {showSkeleton && !isAndroid ? (
        <HomeSkeleton />
      ) : (
        <>
          <HomeHeader
            setOpenAddressSwitcher={setOpenAddressSwitcher}
            wishlistCount={wishlistCount}
          />

          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true },
            )}
          >
            <View style={styles.section}>
              <BannerCarousel data={BANNERS} />
            </View>

            <View style={styles.section}>
              <ShopByBrand />
            </View>

            <View style={styles.section}>
              <CategoriesPager items={categoriesItems} />
            </View>

            <View style={styles.section}>
              <RecommendedForYou
                items={recommendedItems}
                onPressProduct={p => console.log('open', p.id)}
                onToggleWishlist={p => console.log('heart', p.id)}
                onMore={p => console.log('more', p.id)}
              />
            </View>

            <View style={styles.section}>
              <PerviouslyBrowsered
                items={previouslyBrowsedItems}
                onPressProduct={p => console.log('open', p.id)}
                onToggleWishlist={p => console.log('heart', p.id)}
                onMore={p => console.log('more', p.id)}
              />
            </View>

            <View style={styles.section}>
              <BestDealForYou
                items={bestDealsItems}
                onPressProduct={p => console.log('open', p.id)}
                onToggleWishlist={p => console.log('heart', p.id)}
                onMore={p => console.log('more', p.id)}
              />
            </View>
          </Animated.ScrollView>
        </>
      )}

      {isAndroid && overlayVisible && (
        <Animated.View style={[styles.androidOverlay, { opacity: overlayOpacity }] } pointerEvents="none">
          <ActivityIndicator size="large" color="tomato" />
        </Animated.View>
      )}

      <AddressSwitcher openAddressSwitcher={openAddressSwitcher} cancel={cancelModel} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    marginTop: 16,
  },
  androidOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});

export default Home;
