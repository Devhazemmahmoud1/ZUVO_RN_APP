import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { getCairoFont } from '../../ultis/getFont';
import DirhamLogo from '../../icons/Dirham';
import { useRemoveWishlist, useWishlist } from '../../apis/wishlistApi';
import LoadingSpinner from '../../components/Loading';
import { useAddToCart, useCartIndex } from '../../apis/cartApis';
import { useLanguage } from '../../LanguageProvider';
import { t } from 'i18next';

const { width: W } = Dimensions.get('window');

const COLORS = {
  text: '#0F172A',
  sub: '#6B7280',
  line: '#E5E7EB',
  card: '#FFFFFF',
  blue: '#2563EB',
  blueBtn: '#2F6DF3', // closer to noon button
  green: '#16A34A',
  yellow: '#FFEB00',
  bg: '#FFFFFF',
  soft: '#F3F4F6', // wishlist lives on white in the shot
};

const CARD_W = (W - 12 * 2 - 12) / 2;

export default function Wishlist() {
  const nav = useNavigation();
  const { data: wishlist } = useWishlist();
  const { index } = useCartIndex();
  const { mutate: removeWishlist, isPending: removing } = useRemoveWishlist();
  const {mutate: addToCart, isPending: adding} = useAddToCart()

  const { isRTL } = useLanguage()

  const handleRemove = (item: any) => {
    removeWishlist({
      productId: item.productId
    })
  };

  const handleAddToCart = (item: any) => {
    addToCart({
      productId: item.productId
    })
  }
  console.log(index);

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {(adding || removing) && <LoadingSpinner overlay />}
      {/* Header */}
      <View style={[s.header, {flexDirection: isRTL ? 'row-reverse' : 'row'}]}>
        <TouchableOpacity onPress={() => nav.goBack()} hitSlop={HITSLOP}>
          <Ionicons
            name="arrow-back"
            size={22}
            color={COLORS.text}
            style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
          />
        </TouchableOpacity>

        <View style={s.logoRow}>
          {/* substitute your logo */}
          <Text style={[s.logoTxt, getCairoFont('700')]}>{t('app')}</Text>
        </View>

        {/* <TouchableOpacity hitSlop={HITSLOP}>
          <Text style={[s.createTxt, getCairoFont('800')]}>+ Create</Text>
        </TouchableOpacity> */}
      </View>

      {/* Centered list name */}
      <View style={s.listNameWrap}>
        <Text style={[s.listName, getCairoFont('800')]}>{t('default')}</Text>
        <Ionicons name="lock-closed" size={12} color={COLORS.sub} />
      </View>
      <View style={s.thickDivider} />

      {/* Toolbar */}
      <View style={s.toolbar}>
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10 }}>
          <Text style={[s.countTxt, getCairoFont('800')]}>
            {t('items', {count: wishlist?.count})}
          </Text>
          <View style={s.pillFilled}>
            <Text style={[s.pillFilledTxt, getCairoFont('700')]}>{t('default')}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <CircleBtn icon="share-social-outline" />
          <CircleBtn icon="ellipsis-horizontal" />
        </View>
      </View>

      {/* Grid */}
      <FlatList
        data={wishlist?.items || []} // just to show multiple rows
        keyExtractor={it => it.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 16 }}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            isInCart={typeof index[item.productId] !== 'undefined'}
            handleAddToCart={handleAddToCart}
            handleRemove={handleRemove}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

/* ---------- components ---------- */
function ProductCard({ item, isInCart, handleAddToCart, handleRemove }: { item: any; isInCart: any, handleAddToCart: any, handleRemove: any }) {

  const { isRTL } = useLanguage()
  console.log(item)
  const fmt = (n: number) => n?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const to2 = (n: number) => Math.round((n ?? 0) * 100) / 100;

  return (
    <View style={[s.card, { width: CARD_W }]}>
      {/* Image block */}
      <View style={s.imgWrap}>
        <Image
          source={{ uri: item.product.images[0].url }}
          style={s.img}
          resizeMode="contain"
        />
      </View>

      {/* Title */}
      <Text numberOfLines={2} style={[s.title, getCairoFont('800'), isRTL ? { textAlign: 'left' } : undefined ]}>
        {item.product.name_en}
      </Text>

      {/* Rating */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          marginTop: 6,
        }}
      >
        <Text style={[s.rating, getCairoFont('800')]}>
          {item.product.rating?.toFixed(1) ?? '4.4'}
        </Text>
        <Ionicons name="star" size={12} color="#F59E0B" />
        <Text style={s.subtle}>({item.ratingCount ?? 0})</Text>
      </View>

      {/* Price line */}
      <View style={s.priceLine}>
        <Text style={[s.price, getCairoFont('900')]}> 
          <DirhamLogo size={12} /> {fmt(to2(item.product?.price))}
        </Text>
        {!!item.product?.discount && (
          <Text style={s.oldPrice}>{fmt(to2(item.product?.price))}</Text>
        )}
        {!!item.product?.discount && (
          <Text style={[s.offPct, getCairoFont('900')]}>
            {item.product.discount.percentage} {t('off')}
          </Text>
        )}
      </View>

      {/* Shipping/note */}
      {!!item.shipNote && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            marginTop: 6,
          }}
        >
          <Ionicons
            name={/free/i.test(item.shipNote) ? 'car-outline' : 'flame-outline'}
            size={14}
            color={COLORS.sub}
          />
          <Text style={s.subtle}>{item.shipNote}</Text>
        </View>
      )}

      {/* Coupon dashed */}
      {/* <View style={s.coupon}>
        <Ionicons name="pricetag-outline" size={12} color={COLORS.green} />
        <Text style={[s.couponTxt, getCairoFont('800')]}>Extra 30% off</Text>
      </View> */}

      {/* express badge */}
      {/* {item.badge && (          
        <View style={[s.badge, item.badge === 'market' && { backgroundColor: '#E5F7ED' }]}>
          <Text style={[s.badgeTxt, getCairoFont('900')]}>{item.badge}</Text>
        </View>
      )} */}

      {/* Footer buttons */}
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={isInCart ? s.btnOutline : s.btnSolid}
          disabled={isInCart}
          onPress={() => isInCart ? undefined : handleAddToCart(item)}
        >
          <Text
            style={[
              getCairoFont('800'),
              isInCart ? s.btnOutlineTxt : s.btnSolidTxt,
            ]}
          >
            {isInCart ? t('inCart') : t('addToCart')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleRemove(item)}
          style={s.moreBtn}
          activeOpacity={0.9}
        >
          <Ionicons name="trash-outline" size={18} color={COLORS.sub} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CircleBtn({ icon }: { icon: string }) {
  return (
    <TouchableOpacity style={s.circleBtn} activeOpacity={0.9}>
      <Ionicons name={icon} size={18} color={COLORS.text} />
    </TouchableOpacity>
  );
}

/* ---------- styles ---------- */
const HITSLOP = { top: 8, bottom: 8, left: 8, right: 8 };

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingTop: Platform.select({ ios: 2, android: 8 }),
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.line,
  },
  logoRow: { flex: 1, marginLeft: 10 },
  logoTxt: { color: COLORS.text, fontSize: 20, textAlign: 'left', },
  createTxt: { color: COLORS.blue },

  listNameWrap: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 8,
  },
  listName: { color: COLORS.blue },
  thickDivider: { height: 3, backgroundColor: '#E6ECFF' },

  toolbar: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.line,
  },
  countTxt: { color: COLORS.text },

  pillFilled: {
    backgroundColor: COLORS.blue,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillFilledTxt: { color: '#fff', fontSize: 12 },

  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  imgWrap: {
    height: 190, // larger like the screenshot
    backgroundColor: '#F6F7FB',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  img: { width: '100%', height: '100%' },

  title: { color: COLORS.text, lineHeight: 18 },

  rating: { color: COLORS.text, fontSize: 12, backgroundColor: COLORS.soft, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },

  priceLine: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 6 },
  price: { color: COLORS.text },
  oldPrice: { color: COLORS.sub, textDecorationLine: 'line-through' },
  offPct: { color: COLORS.green, textTransform: 'uppercase' },

  coupon: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: COLORS.green,
    borderStyle: 'dashed',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  couponTxt: { color: COLORS.green },

  badge: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.yellow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeTxt: { color: '#111827', fontSize: 11 },

  btnSolid: {
    flex: 1,
    height: 36,
    backgroundColor: 'tomato',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  btnSolidTxt: { color: '#fff' },

  btnOutline: {
    flex: 1,
    height: 36,
    borderWidth: 1.5,
    borderColor: 'tomato',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  btnOutlineTxt: { color: 'tomato' },

  moreBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  subtle: { color: COLORS.sub },
});
