import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Pressable,
  I18nManager,
  ActivityIndicator,
  Animated,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getCairoFont } from '../../ultis/getFont';
import DirhamLogo from '../../icons/Dirham';
import CartItem from './components/CardItem';
import WishlistRail from './components/WishListRail';
import CartTotals from './components/CartTotal';
import { useAddToCart, useCart } from '../../apis/cartApis';
import LoadingSpinner from '../../components/Loading';
import { useWishlist } from '../../apis/wishlistApi';
import { useAuth } from '../../AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useAddressContext } from '../../AddressProvider';
import AddressSwitcher from '../Home/component/AddressesSwitcher';
import { getCurrentPosition } from '../../ultis/getCurrentLocation';
import { haversineMeters } from '../../ultis/haversine';
import { t } from 'i18next';
import { useLanguage } from '../../LanguageProvider';
import EmptyCart from './components/EmptyCart';
import CartSkeleton from './components/CartSkeleton';

const { width: W } = Dimensions.get('window');

const COLORS = {
  text: '#0F172A',
  sub: '#6B7280',
  blue: '#2D6CB5',
  green: '#16A34A',
  yellow: '#FFE500',
  main: 'tomato',
  bg: '#FFFFFF',
  card: '#FFFFFF',
  line: '#E5E7EB',
};

export default function Cart() {
  const { user } = useAuth();
  const navigation: any = useNavigation();
  const { data: cart, isPending } = useCart();
  const { mutate: addToCart, isPending: adding } = useAddToCart();
  const { data: wishlist, isPending: isWishlistPending } = useWishlist();
  const [locationIsFar, setLocationIsFar] = useState(false);
  const { isRTL } = useLanguage();

  const { effectiveAddress } = useAddressContext();

  const [openAddressSwitcher, setOpenAddressSwitcher] = useState<any>(false);

  const cancelModel = () => setOpenAddressSwitcher(false);

  const makeCheckout = () => {
    navigation.navigate('Checkout');
  };

  const handleAddCart = async (id: any) => {
    if (!user) {
      navigation.navigate('Authentication', {
        params: {
          redirectBack: 'Cart',
        },
      });
      return;
    }

    addToCart({ productId: id });
  };

  useEffect(() => {
    getCurrentPosition().then(res => {
      const distance = haversineMeters(
        {
          lat: res.lat,
          lng: res.lng,
        },
        {
          lat: effectiveAddress?.lat as any,
          lng: effectiveAddress?.lng as any,
        },
      );

      if (distance >= 500) {
        console.log('it is far');
        setLocationIsFar(true);
      } else {
        console.log('it not far');
        setLocationIsFar(false);
      }
    });
  }, [effectiveAddress]);

  const hasCartData = Array.isArray(cart?.items);
  const hasWishlistData = Array.isArray(wishlist?.items);
  const cartItems = hasCartData ? (cart?.items as any[]) : [];
  const cartTotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const fmt = (n: number) =>
    n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const to2 = (n: number) => Math.round(n * 100) / 100;

  const initialLoading =
    (!hasCartData && isPending) || (!hasWishlistData && isWishlistPending);
  const overlayLoading =
    (isPending && hasCartData) ||
    (isWishlistPending && hasWishlistData) ||
    adding;

  // Android-only: show a plain white overlay with tomato spinner that fades out when data is ready
  const isAndroid = Platform.OS === 'android';
  const [overlayVisible, setOverlayVisible] = useState<boolean>(isAndroid && initialLoading);
  const overlayOpacity = useRef(new Animated.Value(1)).current;

  if (isAndroid) {
    if (initialLoading && !overlayVisible) {
      setOverlayVisible(true);
      overlayOpacity.setValue(1);
    }
    if (overlayVisible && !initialLoading) {
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start(() => setOverlayVisible(false));
    }
  }

  // iOS keeps the skeleton loader
  if (!isAndroid && initialLoading) {
    return (
      <SafeAreaView style={s.screen}>
        <CartSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[s.screen, Platform.OS === 'android' ? { marginTop: (StatusBar.currentHeight ?? 24) } : null]}>
      {/* ===== Header row ===== */}
      {overlayLoading && <LoadingSpinner overlay />}
      <View style={s.topRow}>
        <Text style={[s.cartTitle, getCairoFont('600')]}>
          {t('cart')}{' '}
          <Text style={[s.cart, getCairoFont('600')]}>
            ({t('items', { count: cartItems.length })})
          </Text>
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('WishList')}
          style={s.wishlistBtn}
          activeOpacity={0.9}
        >
          <Ionicons name="heart-outline" size={18} color={COLORS.text} />
          <Text style={[s.wishlistTxt, getCairoFont('700')]}>
            {t('wishlist')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ===== Address pill ===== */}
      <Pressable style={s.address} onPress={() => setOpenAddressSwitcher(true)}>
        <Ionicons name="location-sharp" size={18} color={COLORS.text} />
        <Text numberOfLines={1} style={[s.addrTxt, getCairoFont('600')]}>
          <Text style={{ fontWeight: '800' }}></Text>{' '}
          {effectiveAddress?.address}
        </Text>
        <Ionicons name="chevron-down" size={18} color={COLORS.text} />
      </Pressable>

      {/* ===== Yellow notice ===== */}
      {locationIsFar && (
        <Pressable
          style={[s.noticeWrap]}
          onPress={() => setOpenAddressSwitcher(true)}
        >
          <View style={s.noticeNotch} />
          <Text
            style={[
              s.noticeTxt,
              getCairoFont('700'),
              { textAlign: isRTL ? 'left' : undefined },
            ]}
          >
            {t('farAway')}{' '}
            <Text style={s.noticeLink}>{t('changeAddress')}</Text>
          </Text>
          <Ionicons name="close" size={18} color="#111" />
        </Pressable>
      )}

      {/* ===== Scrollable content ===== */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Section header */}
        <View style={s.sectionHeader}>
          <View
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
            }}
          >
            <Ionicons
              name="refresh-circle"
              size={18}
              color={COLORS.main}
              style={{ marginLeft: isRTL ? 5 : 0 }}
            />
            <Text style={[s.sectionTitle, getCairoFont('800')]}>
              {t('easyReturn')}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[s.hideDetails, getCairoFont('700')]}>
              {t('hideDetails')}
            </Text>
            <Ionicons name="chevron-up" size={16} color={COLORS.sub} />
          </View>
        </View>

        {/* ===== Items list with one continuous tomato rail ===== */}
        <View style={s.listWithRail}>
          {/* continuous tomato rail */}
          <View style={s.rail} pointerEvents="none" />

          {cartItems.length > 0 ? (
            cartItems.map((it, idx) => (
              <CartItem
                key={it.id}
                item={it}
                isFirst={idx === 0}
                colors={COLORS}
              />
            ))
          ) : (
            <EmptyCart /> // Or any placeholder UI you want to show
          )}
        </View>

        {/* Add more <CartItem/> as needed */}

        {cartItems.length > 0 && (
          <WishlistRail
            title={t('fromYourWish')}
            items={wishlist?.items ?? []}
            onViewAll={() => navigation.navigate('WishList')}
            onPressItem={it => console.log('open', it.id)}
            onAddToCart={it => handleAddCart(it)}
          />
        )}

        {cartItems.length > 0 && (
        <View style={s.cartTotals}>
          <CartTotals
            itemCount={cartItems.length}
            subtotal={cartTotal}
            shippingFee="FREE"
            total={cartTotal}
            cashbackAmount={192.58}
            onApplyCoupon={code => console.log('apply coupon', code)}
            onViewDiscounts={() => console.log('view discounts')}
            onApplyCard={() => console.log('apply card')}
          />
        </View>
        )}
      </ScrollView>

      {/* ===== Sticky Checkout Bar ===== */}
      {cartItems.length > 0 && (
        <Pressable style={s.checkoutWrap} onPress={makeCheckout}>
          <View style={s.checkoutBar}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <Text style={[s.itemsCount, getCairoFont('500')]}>
                {t('items', { count: cartItems.length })}
              </Text>
              <Text style={[s.total, getCairoFont('900')]}>
                {isRTL ? 'د' : <DirhamLogo size={12} color={'#fff'} />}{' '}
                {fmt(to2(cartTotal))}
              </Text>
            </View>
            <Text style={[s.checkoutTxt, getCairoFont('800')]}>
              {t('checkoutCAP')}
            </Text>
            <View style={s.totalWrap}>
              <View
                style={[
                  s.arrowBtn,
                  { transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] },
                ]}
              >
                <Ionicons name="arrow-forward" size={18} color={'#fff'} />
              </View>
            </View>
          </View>
        </Pressable>
      )}

      <AddressSwitcher
        openAddressSwitcher={openAddressSwitcher}
        cancel={cancelModel}
      />

      {isAndroid && overlayVisible && (
        <Animated.View style={[s.androidOverlay, { opacity: overlayOpacity }]} pointerEvents="none">
          <ActivityIndicator size="large" color={COLORS.main} />
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  listWithRail: {
    position: 'relative',
    paddingHorizontal: 0,
    marginTop: 4,
  },
  screen: { flex: 1, backgroundColor: COLORS.bg },
  cart: {
    fontSize: 18,
    color: COLORS.sub,
  },
  /* Header */
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.select({ ios: 6, android: 10 + (Platform.OS === 'android' ? 18 : 0) }),
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  cartTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  wishlistBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#FFF',
    gap: 6,
  },
  wishlistTxt: { marginLeft: 6, fontWeight: '700', color: COLORS.text },

  /* Address */
  address: {
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addrTxt: { flex: 1, color: COLORS.text },

  /* Notice */
  noticeWrap: {
    marginTop: 10,
    backgroundColor: COLORS.main,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  noticeNotch: {
    position: 'absolute',
    left: 20,
    top: -6,
    width: 12,
    height: 12,
    backgroundColor: COLORS.main,
    transform: [{ rotate: '45deg' }],
  },
  noticeTxt: { color: '#fff', flex: 1, fontSize: 13 },
  noticeLink: { fontWeight: '800', textDecorationLine: 'underline' },

  /* Section title */
  sectionHeader: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.line,
  },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  hideDetails: { color: COLORS.sub, fontWeight: '700' },

  /* Item with express rail */
  itemWrap: { paddingHorizontal: 0, marginTop: 4 },
  rail: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 26,
    backgroundColor: COLORS.main,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  railText: {
    transform: [{ rotate: '-90deg' }],
    fontWeight: '800',
    color: '#111',
  },

  itemCard: {
    marginLeft: 26, // leave space for rail
    marginRight: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  itemRow: { flexDirection: 'row' },
  thumbBox: {
    width: 80,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
  },
  thumb: { width: '100%', height: '100%' },

  brand: { color: COLORS.sub, marginBottom: 4, fontWeight: '700' },
  title: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 20,
  },

  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  price: { fontWeight: '900', fontSize: 14, color: COLORS.text },
  oldPrice: {
    marginLeft: 6,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  off: { marginLeft: 6, color: COLORS.green, fontWeight: '800' },

  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  meta: { color: COLORS.text },

  promoBox: {
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.green,
    backgroundColor: '#EAF7EE',
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoText: { color: COLORS.text, fontWeight: '700' },

  hintBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
  },
  hintText: { color: COLORS.sub, flex: 1 },

  protectRow: {
    marginTop: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.line,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  protectTxt: { color: COLORS.text, fontWeight: '700' },
  viewPlans: { color: COLORS.blue, fontWeight: '800' },

  actionsRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qty: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  qtySign: { fontSize: 18, color: COLORS.text, fontWeight: '700' },
  qtyVal: {
    width: 40,
    textAlign: 'center',
    fontWeight: '800',
    color: COLORS.text,
  },

  iconSquare: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  /* Sticky checkout */
  checkoutWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
    alignItems: 'center',
  },
  checkoutBar: {
    width: W - 32,
    backgroundColor: 'tomato',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  itemsCount: { color: '#fff', fontWeight: '800' },
  checkoutTxt: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 1,
    flex: 1,
    textAlign: 'right',
    marginRight: 10,
  },
  totalWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  total: { color: '#fff', fontWeight: '800' },
  arrowBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartTotals: {
    marginTop: 20,
  },
  androidOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
});
