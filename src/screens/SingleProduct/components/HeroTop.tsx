import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ImageSourcePropType,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getCairoFont } from '../../../ultis/getFont';
import { useLanguage } from '../../../LanguageProvider';
import { t } from 'i18next';
import { useAddWishlist, useRemoveWishlist, useWishlistIndex } from '../../../apis/wishlistApi';
import { useAuth } from '../../../AuthContext';
import { useNavigation } from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const { width: W } = Dimensions.get('window');

type Props = {
  brand: string;
  title: string | undefined;
  rating?: number;
  ratingCount?: number;
  images: ImageSourcePropType[]; // <-- array of images
  id: any
};

const THUMB_ITEM_W = 64; // item width incl. right margin
const PLACEHOLDER: ImageSourcePropType = { uri: "https://via.placeholder.com/600x600?text=No+Image" };

export default function HeroTop({
  brand = 'Mobil',
  title,
  rating = 4.4,
  ratingCount = 2,
  images = [],
  id
}: Props) {
  const [index, setIndex] = React.useState(0);
  const sliderRef = React.useRef<FlatList<ImageSourcePropType>>(null);
  const thumbRef = React.useRef<FlatList<ImageSourcePropType>>(null);
  const { index: wishIndex } = useWishlistIndex();
  const { mutate: addWL } = useAddWishlist();
  const { mutate: removeWL } = useRemoveWishlist();
  
  const { isRTL } = useLanguage()
  const { user } = useAuth()
  const inWishlist = wishIndex.has(id)
  const nav: any = useNavigation()


  const dataImages = React.useMemo(
    () => (images && images.length ? images : [PLACEHOLDER]),
    [images]
  );

  // 1-second skeleton loader for iOS only (Android: no skeleton)
  const useSkeleton = Platform.OS !== 'android';
  const [imgLoading, setImgLoading] = React.useState(useSkeleton);
  React.useEffect(() => {
    if (!useSkeleton) return; // skip skeleton on Android
    setImgLoading(true);
    const t = setTimeout(() => setImgLoading(false), 1000);
    return () => clearTimeout(t);
  }, [dataImages, useSkeleton]);

  React.useEffect(() => {
    if (!dataImages.length) return;
    if (index >= dataImages.length) setIndex(0);
  }, [dataImages.length, index]);

  React.useEffect(() => {
    if (!dataImages.length) return;
    const i = Math.min(Math.max(index, 0), dataImages.length - 1);
    thumbRef.current?.scrollToIndex({ index: i, animated: true, viewPosition: 0.5 });
  }, [index, dataImages.length]);

  // React.useEffect(() => {
  //   // keep the active thumb in view (center-ish)
  //   thumbRef.current?.scrollToIndex({
  //     index,
  //     animated: true,
  //     viewPosition: 0.5,
  //   });
  // }, [index]);

  // const goTo = (i: number) => {
  //   console.log('this is the index',i)

  //   // const refer = isRTL ? images.length - 1 - i  : i

  //   setIndex(i);
  //   sliderRef.current?.scrollToIndex({ index: i, animated: true });
  // };

  const goTo = (i: number) => {
    if (!dataImages.length) return;
    const clamped = Math.min(Math.max(i, 0), dataImages.length - 1);
    setIndex(clamped);
    // 4) Guard scrollToIndex on the slider
    try {
      sliderRef.current?.scrollToIndex({ index: clamped, animated: true });
    } catch {
      // will retry in onScrollToIndexFailed
    }
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
      removeWL({ productId: id });
    } else {
      addWL({ productId: id });
    }
  };
  
  return (
    <View style={{ backgroundColor: '#fff' }}>
      {/* Ad pill */}
      <View style={s.adChip}>
        <Image source={dataImages[0]} style={s.adThumb} />
        <Text numberOfLines={1} style={[s.adTxt, isRTL ? { textAlign: 'left' } : undefined ,getCairoFont('700')]}>
          STP Engine Flush 450Ml, Petrol…
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={[s.adPrice, getCairoFont('800')]}>Đ 30</Text>
          <View style={s.adExpress}>
            <Text style={[s.adExpressTxt, getCairoFont('900')]}>express</Text>
          </View>
          <Text style={s.adBadge}>{t('ad')}</Text>
        </View>
      </View>

      {/* Brand + title + actions */}
      <View style={{ paddingHorizontal: 12, paddingTop: 8 }}>
        <Text style={[s.brandLink, isRTL ?  { textAlign: 'left' }  : undefined, getCairoFont('800')]}>{brand}</Text>
        <Text style={[s.heroTitle, isRTL ?  { textAlign: 'left' }  : undefined,getCairoFont('700')]}>{title}</Text>

        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}
        >
          <View style={s.ratingChip}>
            <Text style={[getCairoFont('800'), { color: '#111' }]}>
              {rating.toFixed(1)}{' '}
            </Text>
            <Ionicons name="star" size={12} color="#16A34A" />
            <Text style={{ color: '#6B7280' }}> ({ratingCount})</Text>
          </View>

          <View style={{ flex: 1 }} />

          <TouchableOpacity style={s.iconSq} activeOpacity={0.9} onPress={handleWishList}>
            <Ionicons name={wishIndex.has(id) ? "heart" : "heart-outline"}  size={18} color={wishIndex.has(id) ? "tomato" : "#111"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.iconSq, { marginLeft: 8 }]}
            activeOpacity={0.9}
          >
            <Ionicons name="share-social-outline" size={18} color="#111" />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- HERO CAROUSEL --- */}
      {imgLoading ? (
        <SkeletonPlaceholder borderRadius={12}>
          <SkeletonPlaceholder.Item height={332} width={W} />
        </SkeletonPlaceholder>
      ) : (
        <FlatList
          ref={sliderRef}
          data={dataImages}
          keyExtractor={(_, i) => `s${i}`}
          horizontal
          pagingEnabled
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          style={{ height: 332 }} // ensure it grabs touch area
          renderItem={({ item }) => (
            <View style={s.slide}>
              <Image source={item} style={s.heroImage} resizeMode="contain" />
            </View>
          )}
          onMomentumScrollEnd={e => {
            const i = Math.round(e.nativeEvent.contentOffset.x / W);
            if (i !== index) setIndex(i);
          }}

          onScrollToIndexFailed={({ index: i }) => {
            setTimeout(() => {
              const clamped = Math.min(Math.max(i, 0), dataImages.length - 1);
              sliderRef.current?.scrollToIndex({ index: clamped, animated: true });
            }, 50);
          }}


          getItemLayout={(_, i) => ({ length: W, offset: W * i, index: i })}
        />
      )}

      {/* Thumbnails */}
      <View style={s.thumbRow}>
        {imgLoading ? (
          <SkeletonPlaceholder borderRadius={8}>
            <SkeletonPlaceholder.Item flexDirection="row">
              <SkeletonPlaceholder.Item width={56} height={56} marginRight={12} />
              <SkeletonPlaceholder.Item width={56} height={56} marginRight={12} />
              <SkeletonPlaceholder.Item width={56} height={56} marginRight={12} />
              <SkeletonPlaceholder.Item width={56} height={56} marginRight={12} />
              <SkeletonPlaceholder.Item width={56} height={56} />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        ) : (
          <FlatList
            ref={thumbRef}
            data={dataImages}
            keyExtractor={(_, i) => `t${i}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.thumbRow}
            renderItem={({ item, index: i }) => (
              <TouchableOpacity
                style={s.thumbWrap}
                onPress={() => goTo(i)}
                activeOpacity={0.9}
              >
                <Image
                  source={item}
                  resizeMode="contain"
                  style={[s.thumbSmall, i === index && s.thumbSmallActive]}
                />
              </TouchableOpacity>
            )}
            getItemLayout={(_, i) => ({
              length: THUMB_ITEM_W,
              offset: THUMB_ITEM_W * i,
              index: i,
            })}
      onScrollToIndexFailed={({ index: i }) => {
        setTimeout(() => {
          const clamped = Math.min(Math.max(i, 0), dataImages.length - 1);
          thumbRef.current?.scrollToIndex({ index: clamped, animated: true, viewPosition: 0.5 });
        }, 50);
      }}
          />
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  /* ad pill */
  adChip: {
    marginHorizontal: 12,
    marginTop: 8,
    backgroundColor: '#FFF9D6',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adThumb: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
  },
  adTxt: { flex: 1, color: '#111' },
  adPrice: { color: '#111' },
  adExpress: {
    backgroundColor: '#FFEB00',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  adExpressTxt: { color: '#111827', fontSize: 11 },
  adBadge: { color: '#6B7280', fontSize: 12 },

  /* top info */
  brandLink: { color: '#2563EB' },
  heroTitle: { color: '#0F172A', fontSize: 18, lineHeight: 24 },

  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  iconSq: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },

  /* hero slider */
  slide: {
    width: W, // full page width for snapping
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  heroImage: { width: '86%', height: 300 },
  thumbRow: {
    paddingHorizontal: 12,
    paddingTop: 6,
    flexDirection: 'row',
    paddingBottom: 12,
  },
  thumbWrap: {
    width: THUMB_ITEM_W, // keeps getItemLayout correct
    marginRight: 8,
    alignItems: 'center',
  },
  thumbSmall: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: 'transparent',
    marginLeft: 3,
    marginRight: 3,
  },
  thumbSmallActive: {
    borderColor: '#2563EB',
  },
});
