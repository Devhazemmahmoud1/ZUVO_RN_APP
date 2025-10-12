import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Platform,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getCairoFont } from '../../ultis/getFont';
import DirhamLogo from '../../icons/Dirham';
import HeroTop from './components/HeroTop';
import { SafeAreaView as SafeTopArea } from 'react-native-safe-area-context';
import { useLanguage } from '../../LanguageProvider';
import { t } from 'i18next';
import { useProduct } from '../../apis/getProducts';
import { useNavigation } from '@react-navigation/native';
import { useAddToCart, useCart, useRemoveCartItem, useSetCartItemQty } from '../../apis/cartApis';
import { useCartIndex } from '../../apis/cartApis';
import LoadingSpinner from '../../components/Loading';
import { useAuth } from '../../AuthContext';
import SingleProductSkeleton from './components/SingleProductSkeleton';

const { width: W } = Dimensions.get('window');

const COLORS = {
  text: '#0F172A',
  sub: '#6B7280',
  blue: '#2D6CB5',
  green: '#16A34A',
  yellow: '#FFE500',
  line: '#E5E7EB',
  bg: '#F6F7FB',
  card: '#FFFFFF',
  badge: '#FFE500',
  express: '#FFEB00',
};

type MiniProduct = {
  id: string;
  name: string;
  brand?: string;
  category: any;
  price: number;
  oldPrice?: number;
  rating?: number;
  ratingCount?: number;
  badge?: 'express' | 'market' | 'best';
  img?: any;
  subtitle?: string;
  images: any;
};

export default function SingleProduct({ route }) {
  // qty/footer

  const navigation: any = useNavigation();

  const { data, isPending }: any = useProduct(
    route.params.productId.toString(),
  );
  const { user } = useAuth();
  const { data: cart, isPending: fetching } = useCart();
  const { mutate: addToCart, isPending: addCart } = useAddToCart();
  const { mutate: updateQty, isPending: updating } = useSetCartItemQty();
  const { mutate: removeItem, isPending: removing} = useRemoveCartItem();
  const { index: cartIndex } = useCartIndex();
  const [qty, setQty] = useState<any>(
    cartIndex &&
      typeof data?.data.id !== 'undefined' &&
      typeof cartIndex[data?.data.id] !== 'undefined'
      ? cartIndex[data?.data.id]['qty']
      : 1,
  );

  console.log(cartIndex);

  console.log('this is the cart', cart)

  const cartItems = cart?.items ?? [];
  const cartLineId = cartItems.find(line => line.productId === data?.data.id)?.id;

  console.log('cart item', cartLineId)

  const { isRTL } = useLanguage();
  const hasStock = typeof data?.data?.stock !== 'undefined' && data?.data?.stock !== null;
  const stock = hasStock ? Number(data?.data?.stock) : Infinity;
  const isOutOfStock = hasStock ? stock <= 0 : false;
  // scroll + back-to-top pill
  const y = useRef(new Animated.Value(0)).current;
  const showToTop = y.interpolate({
    inputRange: [300, 450],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const scrollRef = useRef<ScrollView>(null);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    y.setValue(e.nativeEvent.contentOffset.y);
  };

  const getPrice = () => {
    if (data?.data.discount?.percentage) {
      return (
        data?.data.price -
        (data?.data.price * data?.data.discount?.percentage) / 100
      );
    }
  };

  const specs = () => {
    const res = data?.data.attributes
      ? Object.entries(data?.data.attributes).filter(
          ([_, value]) => value !== '' && value !== null && value !== undefined,
        )
      : null;

    if (res && data?.data.oemNumber) {
      res.push(['oemNumber', data.data.oemNumber]);
    }

    return res;
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      return;
    }
    if (!user) {
      navigation.navigate('Authentication', {
        params: {
          redirectBack: 'Cart',
        },
      });
      return;
    }

    addToCart(
      {
        productId:
          (typeof data !== 'undefined' &&
            typeof data.data !== 'undefined' &&
            data.data.id) ||
          0,
        qty: qty,
      },
      {
        onSuccess: () => {
          console.log('all good');
        },
        onError: () => {
          console.log('something went wrong!');
        },
      },
    );
  };

  const handleIncreaseQuantity = () => {
    // Prevent increasing beyond stock or when no stock
    if (Number.isFinite(stock) && stock > 0 && qty >= stock) {
      return;
    }
    if (isOutOfStock) return;

    if (!user) {
      navigation.navigate('Authentication', {
        params: {
          redirectBack: 'Cart',
        },
      });
      return;
    }

    if (
      typeof data?.data.id !== 'undefined' &&
      cartIndex[data?.data.id] &&
      cartLineId
    ) {
      updateQty(
        {
          itemId: cartLineId,
          qty: qty + 1,
        },
        {
          onSuccess: () => setQty(qty + 1),
        },
      );

      return
    } else {
      setQty(qty + 1)
    }

    // setQty(Math.max(1, qty - 1))
  }

  const handleDecreaseQuantity = () => {
    // setQty(qty + 1)
    if (!user) {
      navigation.navigate('Authentication', {
        params: {
          redirectBack: 'Cart',
        },
      });
      return;
    }

    if (
      typeof data?.data.id !== 'undefined' &&
      cartIndex[data?.data.id] &&
      cartLineId
    ) {
      if (cartIndex[data?.data.id].qty - 1 <= 0) {
        removeItem(
          {
            itemId: cartLineId,
          },
          {
            onSuccess: () => {
              setQty(Math.max(1, qty - 1));
            },
          },
        );
      } else {
        updateQty(
          {
            itemId: cartLineId,
            qty: qty - 1,
          },
          {
            onSuccess: () => {
              setQty(Math.max(1, qty - 1));
            },
          },
        );
      }
    } else {
      setQty(Math.max(1, qty - 1))
    }
}

  // totals (you’ll get these from product/variant later)
  // const unit = 99;
  // const subtotal = useMemo(() => qty * unit, [qty, unit]);

  const isInitialLoading = (isPending || fetching) && !data?.data;
  const isAndroid = Platform.OS === 'android';

  // Android-only: white overlay with spinner that fades out when content is ready
  const [overlayVisible, setOverlayVisible] = useState<boolean>(isAndroid && isInitialLoading);
  const overlayOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isAndroid) return;
    if (isInitialLoading) {
      setOverlayVisible(true);
      overlayOpacity.setValue(1);
    } else if (overlayVisible) {
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start(() => setOverlayVisible(false));
    }
  }, [isAndroid, isInitialLoading, overlayVisible, overlayOpacity]);

  // iOS keeps skeleton loader
  if (!isAndroid && isInitialLoading) {
    return <SingleProductSkeleton />;
  }

  const overlayLoading =
    (isPending && data && !!data?.data) ||
    (fetching && !!cart) ||
    updating ||
    addCart ||
    removing;

  return (
    <View style={s.screen}>
      {overlayLoading && <LoadingSpinner overlay />}
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeTopArea edges={['top']} style={{ backgroundColor: '#fff' }}>
        <View style={s.topBar}>
          <TouchableOpacity
            style={s.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={COLORS.text}
              style={[isRTL ? { transform: [{ scaleX: -1 }] } : undefined]}
            />
          </TouchableOpacity>
          <View style={s.searchStub}>
            <Ionicons name="search" size={18} color={COLORS.sub} />
            <Text
              style={[
                s.searchTxt,
                isRTL ? { textAlign: 'left' } : undefined,
                getCairoFont('600'),
              ]}
            >
              {t('whatAreYouLooking')}
            </Text>
            <Ionicons name="camera-outline" size={18} color={COLORS.sub} />
          </View>
        </View>
      </SafeTopArea>

      <View style={{ flex: 1 }}>
        <ScrollView
          ref={scrollRef}
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          <HeroTop
            brand={
              isRTL
                ? data?.data?.category.name_ar
                : data?.data?.category.name_en
            }
            title={isRTL ? data?.data?.name_ar : data?.data?.name_en}
            images={data?.data.images || [] as any}
            id={data?.data.id}
          />

          {/* <PriceRow price={99} oldPrice={108} offText="8%" /> */}
          {/* ---- Price & logistics slab (from your screenshot) ---- */}
          <View style={s.priceSlab}>
            <Row style={{ alignItems: 'flex-end' }}>
              <Text style={[s.price, getCairoFont('900')]}>
                {isRTL ? 'د' : <DirhamLogo size={14} />} {getPrice()}
              </Text>
              {data?.data.discount?.percentage && (
                <>
                  <Text style={s.oldPrice}>{data?.data.price}</Text>
                  <Text style={s.discount}>
                    {data?.data.discount?.percentage}%{' '}
                    <Text style={{ color: COLORS.sub }}>({t('incVat')})</Text>
                  </Text>
                </>
              )}
            </Row>

            {data?.data.count > 0 && (
              <Row gap={8} style={{ marginTop: 6, alignItems: 'center' }}>
                <Ionicons name="cart-outline" size={14} color={COLORS.green} />
                <Text style={s.subtle}>
                  {data?.data.count} {t('soldRec')}
                </Text>
              </Row>
            )}
            <Row gap={8} style={{ marginTop: 10, alignItems: 'center' }}>
              <Badge text="express" />
              <Text style={[s.subtle, { color: COLORS.text }]}>
                {t('getIt')} <Text style={{ fontWeight: '800' }}>30 Aug</Text>{' '}
                <Text style={{ color: COLORS.sub }}>
                  • {t('orderIn')} 21{t('h')} 9{t('m')}
                </Text>
              </Text>
            </Row>
            <PromoLink text={t('getDelTom')} />
            <GreenDotted text={t('discountWithCoupon', { discount: 25 })} />
            <PillLink
              text={t('bestSellerNumber', {
                rank: 5,
                category: isRTL
                  ? data?.data.category.name_ar
                  : data?.data.category.name_en,
              })}
            />
          </View>

          {/* ---- Credit card banners + benefits row ---- */}
          <Card>
            <GreenBanner
              title="Earn 5% CA$HBACK with the noon One Credit Card."
              cta="Apply now"
            />
            <View style={{ height: 10 }} />
            {/* <GreyBanner
              title="Earn 5% cashback with the Mashreq noon Credit Card."
              cta="Apply now"
            /> */}
          </Card>
          <Card>
            <Row style={{ justifyContent: 'space-between' }}>
              <Benefit icon="bus-outline" label={t('delByZuvo')} />
              <Benefit icon="repeat-outline" label={t('cashOnDel')} />
              <Benefit icon="cash-outline" label={t('lowReturns')} />
              <Benefit
                icon="shield-checkmark-outline"
                label={t('secureTrans')}
              />
            </Row>
          </Card>

          {/* ---- Previously browsed ---- */}
          <Section title={t('previouslyBrowsedProd')}>
            <HList data={[]} />
          </Section>

          {/* ---- Bestsellers in this category ---- */}
          <Section title={t('bestSellerInCat')}>
            <HList data={[].slice(0, 10)} />
          </Section>

          {/* ---- Frequently Bought Together (simplified) ---- */}
          <Section title={t('frequently')}>
            <TogetherList data={[].slice(0, 4)} />
            <TouchableOpacity style={s.buyTogetherBtn} activeOpacity={0.9}>
              <Text style={[s.buyTogetherTxt, getCairoFont('800')]}>
                {t('buyTogether')}
              </Text>
            </TouchableOpacity>
          </Section>

          {/* ---- Seller card ---- */}
          <Card>
            <Row
              style={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Row gap={10} style={{ alignItems: 'center' }}>
                <Ionicons
                  name="storefront-outline"
                  size={18}
                  color={COLORS.text}
                />
                <Text style={[s.cardTitle, getCairoFont('800')]}>
                  {t('soldBy')}{' '}
                  <Text style={{ color: COLORS.blue }}>{data?.data.vendor.businessName}</Text>
                </Text>
              </Row>
              <Ionicons name="chevron-forward" size={18} color={COLORS.sub} />
            </Row>
            <Row gap={12} style={{ marginTop: 10 }}>
              <MiniInfo
                icon="time-outline"
                title={t('partnerSince')}
                value={'1' + t('year')}
              />
              <MiniInfo icon="stats-chart-outline" title={t('lowReturns')} />
            </Row>
          </Card>
          {/* <Card>
            <Row
              style={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Row gap={10} style={{ alignItems: 'center' }}>
                <Ionicons name="star" size={16} color="#7C3AED" />
                <Text style={[s.cardTitle, getCairoFont('800')]}>
                  Best seller #7 in{' '}
                  <Text style={{ color: COLORS.blue }}>Engine Oils</Text>
                </Text>
              </Row>
              <Ionicons name="chevron-forward" size={18} color={COLORS.sub} />
            </Row>
          </Card> */}

          {/* ---- Overview / Specifications tabs ---- */}
          <Tabs
            overview={<Text style={s.pBody}>{data?.data.description}</Text>}
            specifications={specs() as any}
          />

          {/* ---- Ratings & reviews ---- */}
          <Card>
            <Text
              style={[
                s.h2,
                isRTL ? { textAlign: 'left' } : undefined,
                getCairoFont('800'),
              ]}
            >
              {t('reviewRating')}
            </Text>
            {/* <Row gap={14} style={{ marginTop: 12 }}> */}
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Text
                style={[
                  { textAlign: 'center' },
                  getCairoFont('900'),
                  { fontSize: 34, color: COLORS.text },
                ]}
              >
                4.4
              </Text>
              <Stars value={4.4} />
              <Text style={s.subtle}>{t('basedOn', { count: 2 })}</Text>
            </View>
            {/* <View style={{ flex: 1 }}>
                {[5, 4, 3, 2, 1].map((n, i) => (
                  <Bar key={n} label={`${n}★`} pct={[0.5, 0.5, 0, 0, 0][i]} />
                ))}
              </View> */}
            {/* </Row> */}

            <EmptyReviews />
            {/* <InfoStrip
              title="How do I review this product?"
              body={
                <>
                  If you recently purchased this product from noon, go to your{' '}
                  <Text style={{ color: COLORS.blue }}>Orders</Text> page and
                  click “Submit Review”.
                </>
              }
            />
            <InfoStrip
              title="Where do the reviews come from?"
              body="Our reviews are from noon customers who purchased the product and submitted a review."
              smile
            /> */}
          </Card>

          {/* ---- Customers also viewed / Products related ---- */}
          <Section title={t('productsRelated')}>
            <HList data={[]} />
          </Section>
          <Section title={t('customerAlsoReviewed')}>
            <HList data={[]} />
          </Section>
        </ScrollView>

        {/* Floating “Back to Top” pill */}
        <Animated.View
          pointerEvents="box-none"
          style={[
            s.toTopWrap,
            {
              opacity: showToTop,
              transform: [
                {
                  translateY: showToTop.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={s.toTop}
            onPress={() =>
              scrollRef.current?.scrollTo({ y: 0, animated: true })
            }
            activeOpacity={0.9}
          >
            <Ionicons name="arrow-up" size={16} color="#fff" />
            <Text style={[s.toTopTxt, getCairoFont('800')]}>
              {t('backToTop')}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Sticky footer: Qty + Add to cart */}
        <View  style={s.sticky}>
          <View style={s.qtyBox}>
            <Text style={s.qtyLabel}>{t('qty')}</Text>
            <Row style={{ alignItems: 'center', marginTop: 4 }}>
              <Step
                
                onPress={handleDecreaseQuantity}
                icon={qty <= 1 ?  'ban-outline'  : "remove"}
                isPending={addCart || updating || removing}
              />
              <Text style={[s.qtyVal, getCairoFont('900')]}>{qty}</Text>
              <Step
                onPress={handleIncreaseQuantity}
                icon={data?.data && data?.data.stock <= qty ? 'ban-outline' : "add"}
                isPending={addCart || updating || removing}
              />
            </Row>
          </View>
          {isOutOfStock ? (
            <View style={s.oos}>
              <Text style={[s.oosTxt, getCairoFont('900')]}>OUT OF STOCK</Text>
            </View>
          ) : data &&
            data.data &&
            cartIndex[data?.data.id] &&
            cartIndex[data?.data.id].qty > 0 ? (
            <TouchableOpacity style={s.inCart} activeOpacity={0.92}>
              <Text style={[s.inCartTxt, getCairoFont('900')]}>
                {t('inCart')}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={s.cta}
              activeOpacity={0.92}
              onPress={handleAddToCart}
              disabled={addCart || updating || removing || isOutOfStock}
            >
              <Text style={[s.ctaTxt, getCairoFont('900')]}>
                {t('addToCart')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {isAndroid && overlayVisible && (
        <Animated.View style={[s.androidOverlay, { opacity: overlayOpacity }]} pointerEvents="none">
          <ActivityIndicator size="large" color={COLORS.blue} />
        </Animated.View>
      )}
    </View>
  );
}

/* ===================== small building blocks ===================== */
function Row({
  children,
  gap = 6,
  style,
}: {
  children: React.ReactNode;
  gap?: number;
  style?: any;
}) {
  return (
    <View style={[{ flexDirection: 'row' }, style]}>
      {React.Children.map(children, (c, i) => (
        <View
          style={{
            marginRight: i === React.Children.count(children) - 1 ? 0 : gap,
          }}
        >
          {c}
        </View>
      ))}
    </View>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <View style={s.card}>{children}</View>;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { isRTL } = useLanguage();

  return (
    <View style={{ marginTop: 12 }}>
      <Text
        style={[
          s.sectionTitle,
          isRTL ? { textAlign: 'left' } : undefined,
          getCairoFont('800'),
        ]}
      >
        {title}
      </Text>
      <View style={{ height: 8 }} />
      {children}
    </View>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <View style={s.badge}>
      <Text style={[s.badgeTxt, getCairoFont('900')]}>{text}</Text>
    </View>
  );
}

function PromoLink({ text }: { text: string }) {
  const { isRTL } = useLanguage();
  return (
    <View style={s.promoLink}>
      <Text style={s.promoTxt}>{text}</Text>
      <Ionicons
        name="chevron-forward"
        size={16}
        color="#111"
        style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
      />
    </View>
  );
}

function GreenDotted({ text }: { text: string }) {
  const { isRTL } = useLanguage();
  return (
    <View style={s.greenDotted}>
      <Text style={[s.greenDottedTxt, getCairoFont('800')]}>{text}</Text>
      <Ionicons
        name="chevron-forward"
        size={16}
        color={COLORS.green}
        style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
      />
    </View>
  );
}

function PillLink({ text }: { text: string }) {
  const { isRTL } = useLanguage();
  return (
    <View style={s.pillLink}>
      <Ionicons name="star" size={14} color="#7C3AED" />
      <Text style={[s.pillLinkTxt, isRTL ? { textAlign: 'left' } : undefined]}>
        {text}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={16}
        color={COLORS.sub}
        style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
      />
    </View>
  );
}

function GreenBanner({ title, cta }: { title: string; cta: string }) {
  return (
    <View style={s.greenBanner}>
      <Text style={[s.bannerTxt, getCairoFont('800')]}>
        {title} <Text style={{ color: COLORS.blue }}>{cta}</Text>
      </Text>
    </View>
  );
}
// function GreyBanner({ title, cta }: { title: string; cta: string }) {
//   return (
//     <View style={s.greyBanner}>
//       <Text style={[s.bannerTxtSub]}>
//         {title} <Text style={{ color: COLORS.blue }}>{cta}</Text>
//       </Text>
//     </View>
//   );
// }

function Benefit({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={s.benefit}>
      <Ionicons name={icon} size={18} color={COLORS.text} />
      <Text style={[s.benefitTxt, getCairoFont('700')]}>{label}</Text>
    </View>
  );
}

function MiniInfo({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value?: string;
}) {
  return (
    <View style={s.miniInfo}>
      <Ionicons name={icon} size={16} color={COLORS.text} />
      <View style={{ marginLeft: 8 }}>
        <Text style={[s.subtle]}>{title}</Text>
        {!!value && (
          <Text style={[getCairoFont('800'), { color: COLORS.text }]}>
            {value}
          </Text>
        )}
      </View>
    </View>
  );
}

/* ----- Horizontal product list: ~2.3 cards visible ----- */
function HList({ data }: { data: MiniProduct[] }) {
  const CARD_W = W * 0.43; // ≈ 2.3 cards on screen (with paddings & gaps)

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      keyExtractor={it => it.id}
      contentContainerStyle={{ paddingHorizontal: 12 }}
      ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
      renderItem={({ item }) => (
        <View style={[s.prodCard, { width: CARD_W }]}>
          <View style={s.prodImgWrap}>
            <Image source={item.img} style={s.prodImg} resizeMode="contain" />
            <TouchableOpacity style={s.floatHeart}>
              {/* <Ionicons
                name={
                  wishIndex.has(Number(item.id)) ? 'heart' : 'heart-outline'
                }
                size={16}
                color={wishIndex.has(Number(item.id)) ? COLORS.text : 'tomato'}
              /> */}
            </TouchableOpacity>
            <TouchableOpacity style={s.floatCart}>
              <Ionicons name="cart-outline" size={16} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          <Text numberOfLines={2} style={[s.prodName, getCairoFont('800')]}>
            {item.name}
          </Text>
          <Row gap={6} style={{ alignItems: 'center', marginTop: 4 }}>
            <Text style={[s.rating, getCairoFont('800')]}>
              {item.rating ?? 4.4}
            </Text>
            <Ionicons name="star" size={12} color={COLORS.green} />
            <Text style={s.subtle}>({item.ratingCount ?? 81})</Text>
          </Row>
          <Row gap={8} style={{ alignItems: 'baseline', marginTop: 4 }}>
            <Text style={[s.priceSm, getCairoFont('900')]}>
              <DirhamLogo size={11} /> {item.price}
            </Text>
            {!!item.oldPrice && (
              <Text style={s.oldPriceSm}>{item.oldPrice}</Text>
            )}
          </Row>
          {!!item.subtitle && <Text style={s.subtle}>{item.subtitle}</Text>}
          <View style={{ height: 8 }} />
          <View style={s.badgeRow}>
            {item.badge === 'express' && <Badge text="express" />}
            {item.badge === 'market' && <Badge text="market" />}
          </View>
        </View>
      )}
    />
  );
}

function TogetherList({ data }: { data: MiniProduct[] }) {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      keyExtractor={it => it.id}
      contentContainerStyle={{ paddingHorizontal: 12 }}
      ItemSeparatorComponent={() => <View style={{ width: 24 }} />}
      renderItem={({ item, index }) => (
        <View style={{ alignItems: 'center' }}>
          <View style={s.comboImg}>
            <Image source={item.img} style={s.comboImgInner} />
            {/* checked mark */}
            <View style={s.comboTick}>
              <Ionicons name="checkmark" size={14} color="#fff" />
            </View>
          </View>
          <Text style={[getCairoFont('800'), { marginTop: 6 }]}>
            <DirhamLogo size={10} /> {item.price}
          </Text>
          {index < data.length - 1 && (
            <Text style={{ marginTop: 4, color: COLORS.sub }}>+</Text>
          )}
        </View>
      )}
    />
  );
}

/* ----- Tabs (Overview / Specifications) ----- */
function Tabs({
  overview,
  specifications,
}: {
  overview: React.ReactNode;
  specifications: [string, string][];
}) {
  const [tab, setTab] = useState<'ov' | 'sp'>('ov');
  const { isRTL } = useLanguage();
  return (
    <View style={{ marginTop: 12 }}>
      <View style={s.tabsBar}>
        <TouchableOpacity
          style={[s.tabBtn, tab === 'ov' && s.tabBtnActive]}
          onPress={() => setTab('ov')}
        >
          <Text style={[s.tabTxt, tab === 'ov' && s.tabTxtActive]}>
            {t('overview')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.tabBtn, tab === 'sp' && s.tabBtnActive]}
          onPress={() => setTab('sp')}
        >
          <Text style={[s.tabTxt, tab === 'sp' && s.tabTxtActive]}>
            {t('specifications')}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={s.tabBody}>
        {tab === 'ov' ? (
          overview
        ) : (
          <View>
            <Text
              style={[
                s.h3,
                isRTL ? { textAlign: 'left' } : undefined,
                getCairoFont('800'),
              ]}
            >
              {t('specifications')}
            </Text>
            <View style={{ height: 10 }} />
            {specifications.map(([k, v]) => (
              <View key={k} style={s.specRow}>
                <Text style={s.specKey}>{t(k)}</Text>
                <Text style={s.specVal}>{v}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

/* ----- Ratings helpers ----- */
function Stars({ value = 4.4 }: { value?: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <Row gap={2} style={{ marginVertical: 4 }}>
      {Array.from({ length: 5 }).map((_, i) => {
        const name =
          i < full ? 'star' : i === full && half ? 'star-half' : 'star-outline';
        return <Ionicons key={i} name={name} size={14} color={COLORS.green} />;
      })}
    </Row>
  );
}

// function Bar({ label, pct }: { label: string; pct: number }) {
//   return (
//     <Row gap={8} style={{ alignItems: 'center', marginBottom: 6 }}>
//       <Text style={{ width: 18, color: COLORS.text }}>{label}</Text>
//       <View style={s.barTrack}>
//         <View style={[s.barFill, { width: `${pct * 100}%` }]} />
//       </View>
//       <Text style={s.subtle}>{Math.round(pct * 100)}%</Text>
//     </Row>
//   );
// }

function EmptyReviews() {
  return (
    <View style={s.emptyReviews}>
      <Ionicons
        name="chatbubble-ellipses-outline"
        size={30}
        color={COLORS.sub}
      />
      <Text style={[s.subtle, { marginTop: 6 }]}>{t('productNoReview')}</Text>
    </View>
  );
}

// function InfoStrip({
//   title,
//   body,
//   smile,
// }: {
//   title: string;
//   body: React.ReactNode;
//   smile?: boolean;
// }) {
//   return (
//     <View style={s.infoStrip}>
//       <Row gap={10}>
//         <Ionicons
//           name={smile ? 'happy-outline' : 'help-circle-outline'}
//           size={18}
//           color={COLORS.text}
//         />
//         <Text style={[getCairoFont('800'), { color: COLORS.text }]}>
//           {title}
//         </Text>
//       </Row>
//       <Text style={[s.subtle, { marginTop: 6 }]}>{body as any}</Text>
//     </View>
//   );
// }

/* ----- Qty stepper ----- */
function Step({
  onPress,
  icon,
  isPending,
  disabled,
}: {
  onPress: () => void;
  icon: 'add' | 'remove' | 'ban-outline';
  isPending: any;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={s.step}
      activeOpacity={0.8}
      disabled={isPending || disabled || icon === 'ban-outline'}
    >
      <Ionicons
        name={icon}
        size={18}
        color={COLORS.text}
      />
    </TouchableOpacity>
  );
}

/* ===================== styles ===================== */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: Platform.select({ ios: 2, android: 8 }),
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  backBtn: { padding: 6, marginRight: 6 },
  searchStub: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchTxt: { flex: 1, marginHorizontal: 6, color: COLORS.sub },

  priceSlab: { backgroundColor: '#fff', padding: 12 },
  price: { fontSize: 22, color: COLORS.text },
  oldPrice: {
    marginLeft: 10,
    color: COLORS.sub,
    textDecorationLine: 'line-through',
    textAlign: 'left'
  },
  discount: { marginLeft: 8, color: COLORS.green, fontWeight: '800' },
  subtle: { color: COLORS.sub },

  badge: {
    backgroundColor: COLORS.express,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  badgeTxt: { color: '#111827', fontSize: 11 },

  promoLink: {
    marginTop: 10,
    backgroundColor: '#FFF8D6',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promoTxt: { color: '#111', fontWeight: '700' },

  greenDotted: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: COLORS.green,
    backgroundColor: '#F2FFF2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greenDottedTxt: { color: COLORS.green },

  pillLink: {
    marginTop: 10,
    backgroundColor: '#F5F3FF',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pillLinkTxt: { color: COLORS.text, flex: 1, marginLeft: 8 },

  card: {
    marginHorizontal: 12,
    marginTop: 12,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardTitle: { color: COLORS.text },

  bannerTxt: { color: COLORS.text },
  bannerTxtSub: { color: COLORS.text },
  greenBanner: { backgroundColor: '#DFF8BF', borderRadius: 12, padding: 12 },
  greyBanner: {
    backgroundColor: '#F5F7FB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
    marginTop: 4,
  },

  benefit: { width: (W - 12 * 2 - 10 * 3) / 4, alignItems: 'center' },
  benefitTxt: {
    marginTop: 2,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 19,
  },

  sectionTitle: { paddingHorizontal: 12, color: COLORS.text, fontSize: 18 },

  prodCard: { backgroundColor: '#fff', borderRadius: 14, padding: 10 },
  prodImgWrap: {
    height: 120,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
    marginBottom: 8,
  },
  prodImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  prodName: { color: COLORS.text },
  rating: { color: COLORS.text, fontSize: 12 },
  priceSm: { color: COLORS.text },
  oldPriceSm: { color: COLORS.sub, textDecorationLine: 'line-through' },
  badgeRow: { flexDirection: 'row', gap: 8 },

  floatHeart: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 6,
    elevation: 2,
  },
  floatCart: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 6,
    elevation: 2,
  },

  buyTogetherBtn: {
    marginTop: 10,
    marginHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'tomato',
    backgroundColor: 'tomato',
    paddingVertical: 12,
    alignItems: 'center',
  },
  buyTogetherTxt: { color: '#fff' },

  comboImg: {
    width: 110,
    height: 110,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    overflow: 'hidden',
  },
  comboImgInner: { width: '100%', height: '100%' },
  comboTick: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // tabs
  tabsBar: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flexDirection: 'row',
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: { borderBottomColor: COLORS.blue },
  tabTxt: { color: COLORS.sub },
  tabTxtActive: { color: COLORS.blue, fontWeight: '800' },
  tabBody: {
    backgroundColor: '#fff',
    padding: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },

  pBody: { color: COLORS.text, lineHeight: 20 },

  h2: { color: COLORS.text, fontSize: 18 },
  h3: { color: COLORS.text, fontSize: 16 },

  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#F7FAFF',
    borderRadius: 10,
    marginBottom: 8,
  },
  specKey: { color: COLORS.sub },
  specVal: { color: COLORS.text, fontWeight: '800' },

  barTrack: { flex: 1, height: 8, backgroundColor: '#E5E7EB', borderRadius: 6 },
  barFill: { height: 8, backgroundColor: COLORS.green, borderRadius: 6 },

  emptyReviews: { alignItems: 'center', paddingVertical: 18 },
  infoStrip: {
    marginTop: 10,
    backgroundColor: '#F6F7FB',
    borderRadius: 12,
    padding: 12,
  },

  // to top pill
  toTopWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 100,
    alignItems: 'center',
  },
  toTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
  },
  toTopTxt: { color: '#fff' },

  // sticky footer
  sticky: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    paddingBottom: Platform.select({ ios: 12, android: 8 }),
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
  },
  qtyBox: {
    width: 105,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    padding: 8,
    alignItems: 'center',
  },
  qtyLabel: { color: COLORS.sub, fontSize: 12 },
  qtyVal: { color: COLORS.text, fontSize: 16, width: 24, textAlign: 'center' },
  step: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  cta: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaTxt: { color: '#fff', fontSize: 16 },
  oos: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  oosTxt: {
    color: '#EF4444',
    fontSize: 16,
  },
  inCartTxt: {
    color: 'tomato',
    fontSize: 16,
  },
  inCart: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: 'tomato',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniInfo: {
    flex: 1, // four equal-width chips
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  androidOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
});
