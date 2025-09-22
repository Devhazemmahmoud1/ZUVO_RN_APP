import { View, Image, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import DirhamLogo from "../../../icons/Dirham";
import { useRemoveCartItem, useSetCartItemQty } from "../../../apis/cartApis";
import LoadingSpinner from "../../../components/Loading";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../AuthContext";
import { useLanguage } from "../../../LanguageProvider";
import { t } from "i18next";


// type CartLine = {
//     id: string;
//     brand: string;
//     title: string;
//     price: number;
//     oldPrice?: number;
//     qty: number;
//     img?: any;
// };

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


export default function CartItem({
    item,
    isFirst,
    colors: COLORS,
  }: {
    item: any;
    isFirst?: boolean;
    colors: any;
  }) {
    const { user } = useAuth();
    const navigation: any = useNavigation()
    const { mutate: updateQty, isPending } = useSetCartItemQty();
    const { mutate: removeItem, isPending: removing} = useRemoveCartItem();

    const { isRTL } = useLanguage()

    const getOldPrice = () => item.unitPrice / (1 - item.discountPct / 100)

    const handleAddQty = () => {
      if (!user) {
        navigation.navigate('Authentication', {
          params: {
            redirectBack: 'Cart',
          },
        });
        return;
      }
      updateQty({
        itemId: item.id,
        qty: item.qty + 1
      })
    }

    const handleDecreaseQty = () => {
      if (!user) {
        navigation.navigate('Authentication', {
          params: {
            redirectBack: 'Cart',
          },
        });
        return;
      }

      if ((item.qty - 1) <= 0) {
        removeItem({
          itemId: item.id
        })
      } else {
        updateQty({
          itemId: item.id,
          qty: item.qty - 1
        })
      }
    }

    const handleRemoveItem = () => {
      if (!user) {
        navigation.navigate('Authentication', {
          params: {
            redirectBack: 'Cart',
          },
        });
        return;
      }

      removeItem({
        itemId: item.id
      })
    }

    return (
      <View style={[s.itemCard, isFirst && s.firstCard]}>
        {(isPending || removing) && <LoadingSpinner overlay /> }
        <View style={s.itemRow}>
          {/* thumb */}
          <View style={s.thumbBox}>
            <Image source={{ uri: item.image }} style={s.thumb} />
          </View>
  
          {/* details */}
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[s.brand, isRTL ? { textAlign: 'left' } : undefined]}>{item.sku}</Text>
            <Text style={[s.title]} numberOfLines={2}>
              {isRTL ? item.name_ar : item.name_en}
            </Text>
  
            {/* price row */}
            <View style={s.priceRow}>
              <Text style={s.price}><Text>{isRTL ? 'د' : <DirhamLogo size={12} />}</Text> {item.unitPrice.toLocaleString()}</Text>
              {item.discountPct ? (
                <>
                  <Text style={s.oldPrice}> {getOldPrice()}</Text>
                  <Text style={s.off}>
                    {' '}
                    {item.discountPct}% {t('off')}
                  </Text>
                </>
              ) : null}
            </View>
  
            {/* delivery lines */}
            <View style={s.metaRow}>
              <Ionicons name="calendar" size={16} color={COLORS.green} />
              <Text style={s.meta}>
                {'  '}{t('getIt')} <Text style={{ color: COLORS.green, fontWeight: '700' }}>{t('tom')}</Text>{' '}
                <Text style={{ color: COLORS.sub }}>{t('orderIn')} 3{t('h')} 32{t('m')}</Text>
              </Text>
            </View>
            {item.freeDelivery && (
            <View style={s.metaRow}>
              <Ionicons name="car-outline" size={16} color={COLORS.text} />
              <Text style={s.meta}>{'  '}{t('freeDel')}</Text>
            </View>
            )}
            {/* <View style={s.metaRow}>
              <Ionicons name="checkmark-circle" size={16} color="#F59E0B" />
              <Text style={s.meta}>{'  '}1 {t('year')} {t('warranty')}</Text>
            </View> */}
  
            {/* promo dashed */}
            {/* <View style={s.promoBox}>
              <Ionicons name="pricetag-outline" size={14} color={COLORS.green} />
              <Text style={s.promoText}>{'  '}Extra 10% off up to 150 Đ</Text>
            </View> */}
          </View>
        </View>
  
        {/* qty + actions */}
        <View style={s.actionsRow}>
          <View style={s.qty}>
            <TouchableOpacity onPress={handleDecreaseQty} style={s.qtyBtn}><Text style={s.qtySign}>–</Text></TouchableOpacity>
            <Text style={s.qtyVal}>{item.qty}</Text>
            <TouchableOpacity onPress={handleAddQty} style={s.qtyBtn}><Text style={s.qtySign}>+</Text></TouchableOpacity>
          </View>
  
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={s.iconSquare}>
              <Ionicons name="share-social-outline" size={18} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity style={s.iconSquare} onPress={handleRemoveItem}>
              <Ionicons name="trash-outline" size={18} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }


  const s = StyleSheet.create({
    listWithRail: {
        position: 'relative',
        paddingHorizontal: 0,
        marginTop: 4,
      },
  screen: { flex: 1, backgroundColor: COLORS.bg },

  // rail (unchanged) – now sits in listWithRail and stretches to all items
  rail: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,            // <— makes it span entire list height
    width: 30,
    backgroundColor: COLORS.main,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  // TWEAK: itemCard now has ONLY bottom border
  itemCard: {
    marginLeft: 30,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,            // <— keep only bottom
    borderColor: COLORS.line,
  },
  // NEW: give the first card a top border to match screenshot
  firstCard: {
    borderTopWidth: 1,
    borderColor: COLORS.line,
  },
  cart: {
    fontSize: 18,
    color: COLORS.sub
  },
  /* Header */
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.select({ ios: 6, android: 10 }),
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  cartTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  wishlistBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.line,
    paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: 10, backgroundColor: '#FFF',
  },
  wishlistTxt: { marginLeft: 6, fontWeight: '700', color: COLORS.text },

  /* Address */
  address: {
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  addrTxt: { flex: 1, color: COLORS.text },

  /* Notice */
  noticeWrap: {
    marginTop: 10,
    backgroundColor: COLORS.main,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12, paddingVertical: 10,
  },
  noticeNotch: {
    position: 'absolute', left: 20, top: -6, width: 12, height: 12,
    backgroundColor: COLORS.main, transform: [{ rotate: '45deg' }],
  },
  noticeTxt: { color: '#fff', flex: 1, fontSize: 13 },
  noticeLink: { fontWeight: '800', textDecorationLine: 'underline' },

  /* Section title */
  sectionHeader: {
    marginTop: 14, paddingHorizontal: 16, paddingVertical: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  hideDetails: { color: COLORS.sub, fontWeight: '700' },

  /* Item with express rail */
  itemWrap: { paddingHorizontal: 0, marginTop: 4 },
  itemRow: { flexDirection: 'row' },
  thumbBox: {
    width: 80, height: 100, borderRadius: 12, overflow: 'hidden',
    backgroundColor: '#F8FAFC',
  },
  thumb: { width: '100%', height: '100%' },

  brand: { color: COLORS.sub, marginBottom: 4, fontWeight: '700' },
  title: { color: COLORS.text, fontSize: 13, fontWeight: '700', lineHeight: 20 },

  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  price: { fontWeight: '900', fontSize: 14, color: COLORS.text },
  oldPrice: { marginLeft: 6, color: '#9CA3AF', textDecorationLine: 'line-through' },
  off: { marginLeft: 6, color: COLORS.green, fontWeight: '800' },

  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  meta: { color: COLORS.text },

  promoBox: {
    marginTop: 8, padding: 8, borderRadius: 8,
    borderWidth: 1, borderStyle: 'dashed', borderColor: COLORS.green,
    backgroundColor: '#EAF7EE', flexDirection: 'row', alignItems: 'center',
  },
  promoText: { color: COLORS.text, fontWeight: '700' },

  hintBox: {
    marginTop: 10, padding: 10, borderRadius: 10, backgroundColor: '#F3F4F6',
    flexDirection: 'row', alignItems: 'center',
  },
  hintText: { color: COLORS.sub, flex: 1 },

  protectRow: {
    marginTop: 10, paddingVertical: 10,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.line,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  protectTxt: { color: COLORS.text, fontWeight: '700' },
  viewPlans: { color: COLORS.blue, fontWeight: '800' },

  actionsRow: {
    marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  qty: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 10, overflow: 'hidden',
    borderWidth: 1, borderColor: COLORS.line,
  },
  qtyBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' },
  qtySign: { fontSize: 18, color: COLORS.text, fontWeight: '700' },
  qtyVal: { width: 40, textAlign: 'center', fontWeight: '800', color: COLORS.text },

  iconSquare: {
    width: 40, height: 40, borderRadius: 10, backgroundColor: '#FFF',
    borderWidth: 1, borderColor: COLORS.line, alignItems: 'center', justifyContent: 'center', marginLeft: 10,
  },

  /* Sticky checkout */
  checkoutWrap: {
    position: 'absolute', left: 0, right: 0, bottom: 10,
    alignItems: 'center',
  },
  itemsCount: { color: '#fff', fontWeight: '800' },
  checkoutTxt: { color: '#fff', fontWeight: '900', fontSize: 16, flex: 1, textAlign: 'center' },
  totalWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  total: { color: '#fff', fontWeight: '800' },
  arrowBtn: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
});
  
  