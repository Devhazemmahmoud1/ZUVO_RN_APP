// components/ProductCard.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Image as RNImage,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TruckDeliveryIcon } from '../../../icons/TruckDeliveryIcon';
import { StarIcon } from '../../../icons/Star';
import { ShoppingCartPlusIcon } from '../../../icons/AddCart';
import DirhamLogo from '../../../icons/Dirham';
import { getCairoFont } from '../../../ultis/getFont';
import { useAddToCart, useCartIndex } from '../../../apis/cartApis';
import ProductLoader from './ProductLoader';
import { useWishlistIndex } from '../../../apis/wishlistApi';
import { useAddWishlist } from '../../../apis/wishlistApi';
import { useRemoveWishlist } from '../../../apis/wishlistApi';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../../../LanguageProvider';
import { prefetchProduct } from '../../../apis/getProducts';
import { useQueryClient } from '@tanstack/react-query';

type Props = {
  item: any;
  layout?: 'row' | 'column';
  cardWidth: number;
  user: any;
};

type ProductImage = {
  id: number;
  url: string;
  alt?: string;
  isPrimary?: boolean;
  productId: any;
  // ...any other fields you use
};

const COLUMN_IMAGE_WIDTH = 120;

export default function ProductCard({
  item,
  layout = 'row',
  cardWidth,
  user,
}: Props) {
  const { isRTL } = useLanguage();
  const nav = useNavigation<any>();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const { mutate: addToCart, isPending } = useAddToCart();
  const { index: cartIndex } = useCartIndex();
  const { index: wishIndex } = useWishlistIndex();
  const { mutate: addWL, isPending: adding } = useAddWishlist();
  const { mutate: removeWL, isPending: removing } = useRemoveWishlist();

  const qc = useQueryClient();
  const inWishlist = wishIndex.has(item.id);

  const images = item?.images?.length ? item.images : [1]; // keep FlatList alive even with 1 img

  console.log('this is the items', item);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (layout !== 'row') return;
    const slide = Math.round(e.nativeEvent.contentOffset.x / cardWidth);
    if (slide !== activeIndex) setActiveIndex(slide);
  };

  const handleWishList = () => {
    if (!user) {
      nav.navigate('Authentication', {
        params: {
          redirectBack: 'ProductsList',
        },
      });
      return;
    }

    if (inWishlist) {
      removeWL({ productId: item.id });
    } else {
      addWL({ productId: item.id });
    }
  };

  const handleAddCart = async () => {
    console.log('should come here');
    if (!user) {
      nav.navigate('Authentication', {
        params: {
          redirectBack: 'ProductsList',
        },
      });
      return;
    }

    console.log('should come here');

    addToCart(
      { productId: item.id, qty: 1 },
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

  const getPriceAfterDiscount = () =>
    item.price - (item.price * item.discount?.percentage) / 100;

  return (
    <View
      style={[
        styles.card,
        layout === 'row'
          ? { width: cardWidth, minHeight: 400 }
          : styles.cardRow,
      ]}
    >
      {layout === 'row' ? (
        <>
          <View style={styles.imageContainer}>
            <FlatList<ProductImage>
              data={
                item.images && item.images.length
                  ? item.images
                  : [{ id: 1, url: 'https://via.placeholder.com/150' }]
              }
              keyExtractor={(it, idx) => String(it.id ?? it.url ?? idx)}
              horizontal
              pagingEnabled
              snapToInterval={cardWidth}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              onScroll={onScroll}
              scrollEventThrottle={16}
              renderItem={item => {
                console.log('this item', item)
                return (
                  <Pressable
                    onPressIn={() => prefetchProduct(qc, (item.item.productId).toString())}
                    onPress={() =>
                      nav.navigate('SingleProduct', {
                        productId: item.item.productId,
                      })
                    }
                  >
                    <ImageWithLoader
                      uri={item.item.url}
                      style={[styles.productImage, { width: cardWidth }]}
                      resizeMode="contain"
                    />
                  </Pressable>
                );
              }}
            />
            <TouchableOpacity
              onPress={handleWishList}
              style={styles.wishlistIcon}
              disabled={adding || removing || isPending}
            >
              <Ionicons
                name={inWishlist ? 'heart' : 'heart-outline'}
                size={18}
                color={inWishlist ? 'tomato' : '#1F2937'}
              />
              {/* <HeartIcon size={20} color={inWishlist ? "tomato" : undefined} /> */}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAddCart}
              disabled={item.stock <= 0 ? true : false}
              style={styles.cartIcon}
            >
              <ShoppingCartPlusIcon
                color={item.stock <= 0 ? 'grey' : undefined}
                size={20}
              />
              {cartIndex[item.id] && cartIndex[item.id].qty > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>
                    {cartIndex[item.id].qty > 9 ? '+9' : cartIndex[item.id].qty}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.dotsContainer}>
              {images.map((_: any, idx: number) => (
                <View
                  key={idx}
                  style={[styles.dot, activeIndex === idx && styles.dotActive]}
                />
              ))}
            </View>
          </View>

          <Pressable
            onPressIn={() => prefetchProduct(qc, (item.id).toString())}
            onPress={() =>
              nav.navigate('SingleProduct', {
                productId: item.id,
              })
            }
          >
            <Text
              style={[styles.productTitle, getCairoFont('600')]}
              numberOfLines={3}
            >
              {isRTL ? item.name_ar : item.name_en}
            </Text>

            <View style={styles.rate}>
              <Text style={styles.rateText}>5.0</Text>
              <StarIcon size={15} color="green" />
              <Text style={styles.totalReview}>(10)</Text>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                <DirhamLogo size={12} />{' '}
                {item.discount?.percentage !== undefined
                  ? getPriceAfterDiscount()
                  : item.price}
              </Text>
              {!!item.discount && (
                <Text style={styles.discount}>
                  {item.discount?.percentage !== undefined && item.price}
                </Text>
              )}
              <Text style={styles.discountRate}>
                {item.discount?.percentage !== undefined
                  ? item.discount?.percentage + '% OFF'
                  : ''}
              </Text>
            </View>

            {item.freeDelivery === true && (
              <View style={styles.del}>
                <TruckDeliveryIcon size={19} color={'tomato'} />
                <Text style={[styles.freeD, getCairoFont('600')]}>
                  Free Delivery
                </Text>
              </View>
            )}

            {item.freeDelivery === false && (
              <View style={styles.del}>
                {/* <TruckDeliveryIcon size={19} color={'tomato'} /> */}
                <Text style={[styles.freeD, getCairoFont('600')]}>
                  + Shipping Fees
                </Text>
              </View>
            )}
          </Pressable>
        </>
      ) : (
        <>
          <View style={styles.imageContainerColumn}>
            <FlatList<ProductImage>
              data={
                item.images && item.images.length
                  ? item.images
                  : [{ id: 1, url: 'https://via.placeholder.com/150' }]
              }
              keyExtractor={(_, idx) => String(idx)}
              horizontal
              pagingEnabled
              snapToInterval={COLUMN_IMAGE_WIDTH}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              onScroll={e => {
                const slide = Math.round(
                  e.nativeEvent.contentOffset.x / COLUMN_IMAGE_WIDTH,
                );
                if (slide !== activeIndex) setActiveIndex(slide);
              }}
              scrollEventThrottle={16}
              renderItem={item => (
                <Pressable
                  onPressIn={() => prefetchProduct(qc, item.item.productId)}
                  onPress={() =>
                    nav.navigate('SingleProduct', {
                      productId: item.item.productId,
                    })
                  }
                >
                  <ImageWithLoader
                    uri={item.item.url}
                    style={[
                      styles.productImageColumn,
                      { width: COLUMN_IMAGE_WIDTH },
                    ]}
                    resizeMode="contain"
                  />
                </Pressable>
              )}
            />
            <TouchableOpacity
              onPress={handleWishList}
              style={styles.wishlistIcon}
              disabled={adding || removing || isPending}
            >
              <Ionicons
                name={inWishlist ? 'heart' : 'heart-outline'}
                size={18}
                color={inWishlist ? 'tomato' : '#1F2937'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAddCart}
              disabled={item.stock <= 0 ? true : false}
              style={[styles.cartIconRow]}
            >
              <ShoppingCartPlusIcon
                color={item.stock <= 0 ? 'grey' : undefined}
                size={20}
              />
            </TouchableOpacity>
            <View style={styles.dotsContainer}>
              {images.map((_: any, idx: number) => (
                <View
                  key={idx}
                  style={[styles.dot, activeIndex === idx && styles.dotActive]}
                />
              ))}
            </View>
          </View>

          <Pressable
            onPressIn={() => prefetchProduct(qc, item.id)}
            onPress={() =>
              nav.navigate('SingleProduct', {
                productId: item.id,
              })
            }
            style={styles.detailsContainerColumn}
          >
            <Text
              style={[styles.productTitle, getCairoFont('600')]}
              numberOfLines={3}
            >
              {item.name_en}
            </Text>
            <View style={styles.rate}>
              <Text style={styles.rateText}>4.7</Text>
              <StarIcon size={15} color="green" />
              <Text style={styles.totalReview}>(10)</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                <DirhamLogo size={12} />{' '}
                {item.discount?.percentage !== undefined
                  ? getPriceAfterDiscount()
                  : item.price}
              </Text>
              {!!item.discount && (
                <Text style={styles.discount}>
                  {item.discount?.percentage !== undefined && item.price}
                </Text>
              )}
              <Text style={styles.discountRate}>
                {item.discount?.percentage !== undefined
                  ? item.discount?.percentage + '% OFF'
                  : ''}
              </Text>
            </View>
            {item.freeDelivery === true && (
              <View style={styles.del}>
                <TruckDeliveryIcon size={19} color={'tomato'} />
                <Text style={[styles.freeD, getCairoFont('600')]}>
                  Free Delivery
                </Text>
              </View>
            )}

            {item.freeDelivery === false && (
              <View style={styles.del}>
                <TruckDeliveryIcon size={19} color={'tomato'} />
                <Text style={[styles.freeD, getCairoFont('600')]}>
                  + Shipping Fees
                </Text>
              </View>
            )}
          </Pressable>
        </>
      )}
    </View>
  );
}

export function ImageWithLoader({
  uri,
  style,
  resizeMode = 'cover',
  timeoutMs = 8000,
  loaderOverlayStyle,
}: any) {
  const [loading, setLoading] = useState(true);
  const alive = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const settle = () => {
    if (!alive.current) return;
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    setLoading(false);
  };

  useEffect(() => {
    alive.current = true;

    // New URI -> assume loading
    setLoading(true);

    // Safety timeout in case callbacks never arrive
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(settle, timeoutMs);

    // If already cached, prefetch resolves immediately; still let onLoadEnd settle.
    RNImage.prefetch(uri).catch(() => {
      /* ignore */
    });

    return () => {
      alive.current = false;
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
    };
  }, [uri, timeoutMs]);

  return (
    // key={uri} forces a full remount if the URL changes
    <View key={uri} style={style}>
      <Image
        source={{ uri }}
        resizeMode={resizeMode}
        // Fill the wrapper; wrapper defines the size
        style={StyleSheet.absoluteFill}
        // Only settle in these two to avoid races
        onLoadEnd={settle}
        onError={e => {
          console.warn('Image error:', uri, e.nativeEvent?.error);
          settle();
        }}
      />
      {loading && (
        <View style={[styles.loaderOverlay, loaderOverlayStyle]}>
          <ProductLoader color="#FF6347" size={35} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    zIndex: 2,
  },
  card: {
    backgroundColor: '#fff',
    padding: 5,
    position: 'relative',
    height: 350,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    height: 150,
  },
  imageContainer: { position: 'relative' },
  productImage: {
    height: 250,
    marginBottom: 8,
    backgroundColor: '#F7F7FA',
    padding: 15,
  },
  wishlistIcon: {
    position: 'absolute',
    top: 3,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
  },
  cartIcon: {
    position: 'absolute',
    top: 215,
    right: 8,
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 5,
    elevation: 5,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
  },

  cartIconRow: {
    position: 'absolute',
    top: 110,
    left: 0,
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 5,
    elevation: 5,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: '400',
    marginBottom: 5,
    letterSpacing: 0.5,
    height: 51,
    maxHeight: 51,
    overflow: 'hidden',
    lineHeight: 17,
  },
  rate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0f0fa',
    minWidth: 70,
    width: 70,
  },
  rateText: { fontSize: 12, fontWeight: '600' },
  totalReview: { fontSize: 12, color: '#888' },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  price: { fontSize: 14, fontWeight: '600' },
  discount: { fontSize: 12, color: '#888', textDecorationLine: 'line-through' },
  discountRate: { fontSize: 12, color: 'green', fontWeight: '600' },
  del: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 5,
  },
  freeD: { fontSize: 13, color: '#333', fontWeight: '500' },
  dotsContainer: {
    position: 'absolute',
    bottom: 23,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ccc' },
  dotActive: {
    borderWidth: 1,
    borderColor: 'tomato',
    backgroundColor: 'tomato',
    width: 7,
    height: 7,
  },
  // column layout
  imageContainerColumn: {
    width: COLUMN_IMAGE_WIDTH,
    height: '100%',
    position: 'relative',
    marginRight: 10,
  },
  productImageColumn: { height: '100%' },
  detailsContainerColumn: { flex: 1, justifyContent: 'space-between' },
  // loaderOverlay: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(255, 255, 255, 0.6)',
  //   zIndex: 2,
  // },
  cartIconWithBadge: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'tomato',
    borderRadius: 10,
    paddingHorizontal: 5,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },

  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
