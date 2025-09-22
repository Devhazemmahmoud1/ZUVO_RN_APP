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
  import { formatPrice } from '../../../ultis/priceFormat';
  import { formatCount } from '../../../ultis/priceFormat';
import { getCairoFont } from '../../../ultis/getFont';
import { t } from 'i18next';
import { useLanguage } from '../../../LanguageProvider';
  
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  
  export type Product = {
    id: string;
    title: string;
    img?: any;              // require('...') or { uri }
    bg?: string;            // fallback block color if no image
    rating?: number;        // 0..5
    ratingCount?: number;   // e.g. 25500
    price: number;          // current price
    oldPrice?: number;      // original price
    tagline?: string;       // e.g. 'Lowest price in a...'
    bestSeller?: boolean;
    express?: boolean;
  };
  
  type Props = {
    items: Product[];
    title?: string;
    onPressProduct?: (p: Product) => void;
    onToggleWishlist?: (p: Product) => void;
    onMore?: (p: Product) => void;
  };
  
  const VISIBLE = 2.1;
  
  const HPAD = 12;
  
  const GAP = 10;
  
  const CARD_W = Math.min(SCREEN_WIDTH - HPAD * 2 - GAP * 2) / VISIBLE;
  const CARD_H = 310;
  const RADIUS = 14;
  
  export default function RecommendedForYou({
    items,
    title = t('previouslyBrowsed'),
    onPressProduct,
    onToggleWishlist,
    onMore,
  }: Props) {

    const { isRTL } = useLanguage()

    return (
      <View style={styles.wrap}>
        <Text style={[styles.header, isRTL ? {textAlign: 'left'} : undefined ,getCairoFont('700')]}>{title}</Text>
  
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: HPAD }}
          ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
          renderItem={({ item }) => (
            <ProductCard
              data={item}
              onPress={() => onPressProduct?.(item)}
              onHeart={() => onToggleWishlist?.(item)}
              onMore={() => onMore?.(item)}
            />
          )}
        />
      </View>
    );
  }
  
  function ProductCard({
      data,
      onPress,
      onHeart,
      onMore,
    }: {
      data: Product;
      onPress?: () => void;
      onHeart?: () => void;
      onMore?: () => void;
    }) {
      const discount =
        data.oldPrice && data.oldPrice > data.price
          ? Math.round(((data.oldPrice - data.price) / data.oldPrice) * 100)
          : 0;
    
      return (
        <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.cardShadow}>
          <View style={styles.card}>
            {/* Image */}
            <View style={styles.imgBox}>
              {data.img ? (
                <Image resizeMode="cover" source={data.img} style={styles.img} />
              ) : (
                <ImageBackground style={styles.img} source={undefined}>
                  <View style={[StyleSheet.absoluteFill, { backgroundColor: data.bg ?? '#F1F4F9' }]} />
                </ImageBackground>
              )}
    
              {/* Best Seller */}
              {data.bestSeller ? (
                <View style={styles.bestSellerPill}>
                  <Text style={styles.bestSellerText}>{t('bestSeller')}</Text>
                </View>
              ) : null}
    
              {/* Heart */}
              <TouchableOpacity onPress={onHeart} style={styles.heartBtn}>
                <Ionicons name="heart-outline" size={18} color="#1F2937" />
              </TouchableOpacity>
    
              {/* More */}
              <TouchableOpacity onPress={onMore} style={styles.moreBtn}>
                <Ionicons name="ellipsis-vertical" size={16} color="#1F2937" />
              </TouchableOpacity>
            </View>
    
            {/* Title */}
            <Text numberOfLines={2} style={[styles.title]}>
              {data.title}
            </Text>
    
            {/* Rating */}
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#22C55E" />
              <Text style={styles.ratingText}>
                {data.rating?.toFixed(1) ?? '4.6'}{' '}
                <Text style={styles.ratingCount}>({formatCount(data.ratingCount ?? 25500)})</Text>
              </Text>
            </View>
    
            {/* Price */}
            <View style={styles.priceRow}>
              <Text style={styles.price}>د {formatPrice(data.price)}</Text>
              {data.oldPrice ? (
                <>
                  <Text style={styles.oldPrice}> {formatPrice(data.oldPrice)}</Text>
                  {discount > 0 ? <Text style={styles.discount}> {discount}%</Text> : null}
                </>
              ) : null}
            </View>
    
            {/* Tagline */}
            {data.tagline ? <Text numberOfLines={1} style={styles.tagline}>{data.tagline}</Text> : null}
    
            {/* Express chip */}
            {data.express ? (
              <View style={styles.expressChip}>
                <Text style={styles.expressText}>express</Text>
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
      );
    }
  
    const styles = StyleSheet.create({
      wrap: {
        marginTop: 8,
        marginBottom: 4,
      },
      header: {
        paddingHorizontal: 16,
        marginBottom: 10,
        fontSize: 20,
        fontWeight: '800',
        color: '#152032',
      },
    
      cardShadow: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 2,
      },
      card: {
        width: CARD_W,
        height: CARD_H,
        borderRadius: RADIUS,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F1F4F9',
      },
    
      imgBox: {
        height: 156,
        backgroundColor: '#F7F7FA',
      },
      img: {
        width: '100%',
        height: '100%',
      },
    
      bestSellerPill: {
        position: 'absolute',
        left: 10,
        top: 10,
        backgroundColor: '#2D6CB5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
      },
      bestSellerText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
      },
    
      heartBtn: {
        position: 'absolute',
        right: 10,
        top: 10,
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
      },
      moreBtn: {
        position: 'absolute',
        right: 10,
        bottom: 8,
        width: 30,
        height: 30,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.95,
      },
    
      title: {
        paddingHorizontal: 12,
        paddingTop: 10,
        fontSize: 15,
        color: '#111827',
        fontWeight: '600',
      },
    
      ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        marginTop: 6,
      },
      ratingText: {
        marginLeft: 4,
        fontSize: 13,
        color: '#111827',
        fontWeight: '700',
      },
      ratingCount: {
        color: '#9CA3AF',
        fontWeight: '400',
      },
    
      priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        marginTop: 6,
      },
      price: {
        color: '#111827',
        fontSize: 16,
        fontWeight: '800',
      },
      oldPrice: {
        marginLeft: 6,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
        fontSize: 13,
      },
      discount: {
        marginLeft: 4,
        color: '#16A34A',
        fontSize: 13,
        fontWeight: '700',
      },
    
      tagline: {
        paddingHorizontal: 12,
        marginTop: 4,
        fontSize: 12,
        color: '#6B7280',
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
      expressText: {
        color: '#111827',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.2,
      },
    });