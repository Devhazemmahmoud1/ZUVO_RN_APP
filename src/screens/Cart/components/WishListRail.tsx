// components/WishlistRail.tsx
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getCairoFont } from '../../../ultis/getFont';
import DirhamLogo from '../../../icons/Dirham';
import { useCartIndex } from '../../../apis/cartApis';
import { t } from 'i18next';
import { useLanguage } from '../../../LanguageProvider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// export type WishlistItem = {
//   id: string;
//   title: string;
//   img?: any;        // require('...') or { uri }
//   bg?: string;      // fallback color if no image
//   rating?: number;  // 0..5
//   ratingCount?: number;
//   price: number;
//   oldPrice?: number;
//   tag?: string;     // e.g. 'Selling out fast'
//   express?: boolean;
// };

type Props = {
  title?: string;
  items: any[];
  onViewAll?: () => void;
  onPressItem?: (item: any) => void;
  onAddToCart?: (item: any) => void;
};

const VISIBLE = 2.3; // <<< 2.3 cards visible
const HPAD = 16; // horizontal padding around the rail
const GAP = 12; // gap between cards
const CARD_W = (SCREEN_WIDTH - HPAD * 2 - GAP * 2) / VISIBLE;
const CARD_H = 285;
const IMG_H = 180;
const R = 14;

export default function WishlistRail({
  title = 'From your Wishlist',
  items,
  onViewAll,
  onPressItem,
  onAddToCart,
}: Props) {
  const { index } = useCartIndex();
  const { isRTL } = useLanguage();

  return (
    <View style={s.wrap}>
      {/* Header */}
      <View style={s.headerRow}>
        <Text style={[s.headerTxt, getCairoFont('600'), isRTL ? { textAlign: 'left' } : undefined]}>{title}</Text>
        <TouchableOpacity
          onPress={onViewAll}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[s.viewAll, getCairoFont('500')]}>{t('viewAll')}</Text>
        </TouchableOpacity>
      </View>

      {/* Cards */}
      <FlatList
        data={items}
        keyExtractor={it => it.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: HPAD }}
        ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
        decelerationRate="fast"
        snapToInterval={CARD_W + GAP} // nice snap feel
        snapToAlignment="start"
        renderItem={({ item }) => (
          <Card
            data={item}
            onPress={() => onPressItem?.(item)}
            onAdd={(item) => {
              onAddToCart && onAddToCart(item)
            }}
            index={index}
          />
        )}
        getItemLayout={(_, i) => ({
          length: CARD_W + GAP,
          offset: (CARD_W + GAP) * i,
          index: i,
        })}
      />
    </View>
  );
}

function Card({
  data,
  index,
  onPress,
  onAdd,
}: {
  data: any;
  index: any;
  onPress?: () => void;
  onAdd?: (value) => void;
}) {
  const [hearted, setHearted] = useState(true);
  //   const discount =
  //     data.oldPrice && data.oldPrice > data.price
  //       ? Math.round(((data.oldPrice - data.price) / data.oldPrice) * 100)
  //       : 0;

  const { isRTL } = useLanguage()

  return (
    <TouchableOpacity
      style={s.cardShadow}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={s.card}>
        {/* image */}
        <View style={s.imgBox}>
          {data.product.images ? (
            <Image
              source={{ uri : data.product.images[0]?.url }}
              style={s.img}
              resizeMode="contain"
            />
          ) : (
            <ImageBackground
              style={s.img}
              source={require('../../../assets/main_logo.png')}
            >
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: data.bg ?? '#F3F4F6' },
                ]}
              />
            </ImageBackground>
          )}

          {/* floating heart */}
          <TouchableOpacity
            style={s.floatBtn}
            onPress={() => setHearted(!hearted)}
          >
            <Ionicons
              name={hearted ? 'heart' : 'heart-outline'}
              size={16}
              color="tomato"
            />
          </TouchableOpacity>

          {/* floating add-to-cart */}
          <TouchableOpacity
            style={[s.floatBtn, { bottom: 10, top: undefined }]}
            onPress={() =>
              typeof index[data.product.id] === 'undefined' ? onAdd && onAdd(data.product.id) : undefined
            }
            disabled={typeof index[data.product.id] !== 'undefined'}
          >
            {typeof index[data.product.id] === 'undefined' ? (
              <Ionicons name="cart-outline" size={16} color="#111827" />
            ) : (
              <Ionicons name="checkmark-done-outline" size={16} color="green" />
            )}
          </TouchableOpacity>
        </View>

        {/* title */}
        <Text numberOfLines={2} style={[s.title, isRTL? { textAlign: 'left' } : undefined, getCairoFont('500')]}>
          {data.product.name_en}
        </Text>

        {/* rating */}
        <View style={s.ratingRow}>
          <Text style={s.rateNum}>
            {data.rating?.toFixed(1) ?? '4.4'}{' '}
            <Ionicons name="star" size={12} color="#22C55E" />
          </Text>
          <Text style={s.rateCnt}> ({data.ratingCount ?? 81})</Text>
        </View>

        {/* price */}
        <View style={s.priceRow}>
          <Text style={s.price}>
            <DirhamLogo size={12} /> {data.product.price}
          </Text>
          {/* {!!data.oldPrice && <Text style={s.oldPrice}> {data.oldPrice}</Text>} */}
          {/* {!!discount && <Text style={s.discount}> {discount}%</Text>} */}
        </View>

        {/* tag + express */}
        {/* {data.tag ? <Text style={s.tagLine} numberOfLines={1}>{data.tag}</Text> : null}
        {data.express ? (
          <View style={s.expressChip}><Text style={s.expressTxt}>express</Text></View>
        ) : null} */}
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  wrap: { marginTop: 18 },
  headerRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTxt: { flex: 1, fontSize: 20, color: '#0F172A' },
  viewAll: { color: '#2D6CB5', fontSize: 12 },

  cardShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: R,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  imgBox: { height: IMG_H, backgroundColor: '#F8FAFC', padding: 10 },
  img: { width: '100%', height: '100%' },

  floatBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  title: {
    paddingHorizontal: 12,
    paddingTop: 10,
    color: '#111827',
    lineHeight: 18,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 6,
  },
  rateNum: { fontSize: 12, fontWeight: '800', color: '#111827' },
  rateCnt: { fontSize: 12, color: '#9CA3AF' },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 6,
  },
  price: { fontSize: 14, fontWeight: '700', color: '#111827' },
  oldPrice: {
    marginLeft: 6,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  discount: { marginLeft: 6, color: '#16A34A', fontWeight: '800' },

  tagLine: {
    paddingHorizontal: 12,
    marginTop: 6,
    color: '#6B7280',
    fontSize: 12,
  },

  expressChip: {
    marginTop: 8,
    marginLeft: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#FFE500',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  expressTxt: { fontSize: 11, fontWeight: '800', color: '#111827' },
});
