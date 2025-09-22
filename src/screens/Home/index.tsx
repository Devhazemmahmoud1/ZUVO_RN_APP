import { Animated, StyleSheet, View } from 'react-native';
import BannerCarousel from './component/BannerCarosuel';
import HomeHeader from './component/Header';
import CategoriesPager from './component/CategoryPager';
import RecommendedForYou from './component/Recomended';
import { useRef, useState } from 'react';
import PerviouslyBrowsered from './component/PerviouslyBrowsered';
import BestDealForYou from './component/BestDealsForYou';
import { decodeVIN } from '../../ultis/carModelFinder';
import ShopByBrand from '../ProductsList/components/ShopByBrand';
import AddressSwitcher from './component/AddressesSwitcher';

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

export const RECOMMENDED: any[] = [
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

// const HEADER_EXPANDED = 210;   // tweak to your taste
// const HEADER_COLLAPSED = 120;  // how short it becomes

const Home = () => {
  const [openAddressSwitcher, setOpenAddressSwitcher] = useState<any>(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  console.log(decodeVIN('55SWF4KB9HU183537'));

  const cancelModel = () => setOpenAddressSwitcher(false)

  return (
    <View style={styles.screen}>
      <HomeHeader
        setOpenAddressSwitcher={setOpenAddressSwitcher}
      />
      {/* Scrollable content */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }, // we animate transforms/opacity on the header
        )}
      >
        <View style={styles.section}>
          <BannerCarousel data={BANNERS} />
        </View>

        <View style={styles.section}>
          <ShopByBrand />
        </View>
        <View style={styles.section}>
          <CategoriesPager items={CATEGORIES} />
        </View>

        <View style={styles.section}>
          <RecommendedForYou
            items={RECOMMENDED}
            onPressProduct={p => console.log('open', p.id)}
            onToggleWishlist={p => console.log('heart', p.id)}
            onMore={p => console.log('more', p.id)}
          />
        </View>

        <View style={styles.section}>
          <PerviouslyBrowsered
            items={RECOMMENDED}
            onPressProduct={p => console.log('open', p.id)}
            onToggleWishlist={p => console.log('heart', p.id)}
            onMore={p => console.log('more', p.id)}
          />
        </View>

        <View style={styles.section}>
          <BestDealForYou
            items={RECOMMENDED}
            onPressProduct={p => console.log('open', p.id)}
            onToggleWishlist={p => console.log('heart', p.id)}
            onMore={p => console.log('more', p.id)}
          />
        </View>
      </Animated.ScrollView>

      <AddressSwitcher openAddressSwitcher={openAddressSwitcher} cancel={cancelModel}/>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 24, // space below last section
  },
  section: {
    marginTop: 16,
  },
});

export default Home;
