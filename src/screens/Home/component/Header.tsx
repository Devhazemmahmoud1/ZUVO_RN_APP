// components/HomeHeader.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  StyleSheet as RNStyleSheet,
  Pressable,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBg } from '../../../icons/BG';
import { getCairoFont } from '../../../ultis/getFont';
// import { HeartIcon } from '../../../icons/Heart';
import CyclingPlaceholder from './CyclePlaceholder';
import { useNavigation } from '@react-navigation/native';
import { getCurrentPosition } from '../../../ultis/getCurrentLocation';
import { haversineMeters } from '../../../ultis/haversine';
import { useAddressContext } from '../../../AddressProvider';
import { t } from 'i18next';
import { useAuth } from '../../../AuthContext';

type Props = {
  setOpenAddressSwitcher: React.Dispatch<React.SetStateAction<boolean>>;
  wishlistCount?: number;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TILE = 74;

type Tile = { id: string; label: string; bg: string; fg?: string };
const TILES: Tile[] = [
  { id: 'zuvo', label: 'Zuvo', bg: 'tomato', fg: '#fff' },
  { id: 'mall', label: 'Cars', bg: '#F6F7FB', fg: '#3B3BE0' },
  { id: 'food', label: 'Services', bg: '#FFFFFF', fg: '#111' },
  { id: '15', label: 'B2B', bg: '#FFF3F3', fg: '#D93025' },
  { id: 'now', label: 'Global', bg: '#FFFFFF', fg: '#111' },
];

// type Props = {
//   onChangeAddress?: () => void;
//   onCloseBanner?: () => void;
//   onSearch?: (q: string) => void;
// };

export default function HomeHeader({ setOpenAddressSwitcher, wishlistCount = 0 }: Props) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const navigation: any = useNavigation();
  const [locationIsFar, setLocationIsFar] = useState(false);

  const { user } = useAuth();

  const {
    effectiveAddress,
    refreshCurrentLocation,
  } = useAddressContext();

  // const isActive = (a: any) =>
  //   !!activeSelection &&
  //   'id' in activeSelection &&
  //   (activeSelection as any).id === a.id;

  const insets = useSafeAreaInsets(); // ✅ safe area
  const TOP_PAD = (insets.top || 0) + -10; // push content below clock/notch used to be + 5 not -10
  const SEARCH_H = 40; // search box height
  const SEARCH_GAP = 12; // distance from bottom
  const CONTENT_BOTTOM_SPACE = SEARCH_H + SEARCH_GAP + 8; // reserve space for absolute search row
  const HEADER_MIN = 180; // base height of header area (tweak)

  const stars = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        key: i,
        top: 12 + Math.random() * 120,
        left: Math.random() * (SCREEN_WIDTH - 12),
        size: 1 + Math.random() * 2.2,
        opacity: 0.45 + Math.random() * 0.3,
      })),
    [],
  );

  useEffect(() => {
    if (!effectiveAddress) {
      refreshCurrentLocation();
      return;
    }

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
        setLocationIsFar(true);
      } else {
        setLocationIsFar(false);
      }
    });
  }, [effectiveAddress, refreshCurrentLocation]);

  const onChangeAddress = () => {
    if (!user) return;
    setOpenAddressSwitcher(true);
  };
  const displayedAddress = effectiveAddress?.address ?? '...';

  return (
    <View style={styles.wrapper}>
      <View
        // ✅ ensure header is tall enough to fully contain gradient + search row
        style={[styles.header, { minHeight: (insets.top || 0) + HEADER_MIN }]}
      >
        <GradientBg style={RNStyleSheet.absoluteFillObject} />

        <View style={styles.starsLayer} pointerEvents="none">
          {stars.map(s => (
            <View
              key={s.key}
              style={{
                position: 'absolute',
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                borderRadius: s.size / 2,
                backgroundColor: 'rgba(255,255,255,0.95)',
                opacity: s.opacity,
              }}
            />
          ))}
        </View>

        {/* ✅ apply safe-area padding on TOP, and reserve space at BOTTOM */}
        <View
          style={[
            styles.content,
            { paddingTop: TOP_PAD, paddingBottom: CONTENT_BOTTOM_SPACE },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tilesRow}
          >
            {TILES.map(t => {
              // Ensure first tab (Zuvo) label stays white over tomato background
              const forceWhite = t.id === 'zuvo' || String(t.bg).toLowerCase() === 'tomato';
              const textColor = forceWhite ? '#fff' : (t.fg ?? '#111');

              return (
                <TouchableOpacity
                  key={t.id}
                  activeOpacity={0.8}
                  style={[styles.tile, { backgroundColor: t.bg }]}
                >
                  <Text
                    style={[styles.tileText, { color: textColor }]}
                    numberOfLines={2}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Location row */}
          <Pressable style={styles.locRow} onPress={onChangeAddress}>
            <Ionicons name="location-sharp" size={18} color="#fff" />
            <Text style={styles.locText} numberOfLines={1}>
              <Text style={styles.locBold}>{t('default')}</Text>
              <Text>
              {" "}-{" "}
                {displayedAddress}
              </Text>
            </Text>
            <Ionicons name="chevron-down" size={18} color="#fff" />
          </Pressable>

          {/* Yellow banner */}
          {locationIsFar && (
            <View style={styles.bannerWrap}>
              <View style={styles.bannerNotch} />
              <View style={styles.banner}>
                <Text style={[styles.bannerText]}>
                  {t('farAway')} {' '}
                  <Text
                    onPress={onChangeAddress}
                    style={styles.bannerLink}
                    suppressHighlighting
                  >
                    {t('changeAddress')}
                  </Text>
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* ✅ search stays pinned INSIDE header */}
        <View style={[styles.searchRowAbs, { bottom: SEARCH_GAP }]}>
          <View style={[styles.searchBox, { height: SEARCH_H }]}>
            <Ionicons
              name="search"
              size={18}
              color="#8A94A6"
              style={{ marginRight: 8 }}
            />

            <CyclingPlaceholder visible={!focused && !query} />

            <TextInput
              value={query}
              onChangeText={setQuery}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder=""
              placeholderTextColor="#8A94A6"
              style={[styles.searchInput, getCairoFont('600')]}
              returnKeyType="search"
              // onSubmitEditing={e => onSearch?.(e.nativeEvent.text)}
            />
          </View>
          {/* <TouchableOpacity
            style={[styles.iconBtn, { height: SEARCH_H, width: SEARCH_H }]}
          /> */}
          <TouchableOpacity
            style={[styles.iconBtn, { height: SEARCH_H, width: SEARCH_H }]}
            onPress={() => {
              if (!user) {
                navigation.navigate('Authentication', {
                  params: { redirectBack: 'WishList' },
                });
                return;
              }
              navigation.navigate('WishList');
            }}
          >
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{wishlistCount}</Text>
            </View>
            <Ionicons name={'heart-outline'} size={18} color={'#1F2937'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: 'transparent' },
  header: {
    position: 'relative',
    width: '100%',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#2A5B8F',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  content: {
    // paddingTop / paddingBottom set inline above using insets & constants
  },
  starsLayer: { ...RNStyleSheet.absoluteFillObject },
  searchRowAbs: {
    position: 'absolute',
    left: 16,
    right: 16,
    // bottom set inline above as SEARCH_GAP
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    // height set inline
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  iconBtn: {
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    // height/width set inline
  },

  /* Tiles */
  tilesRow: {
    paddingHorizontal: 14,
    paddingTop: 18,
    paddingBottom: 12,
    alignItems: 'center',
    gap: 4,
  },
  tile: {
    width: TILE,
    height: TILE,
    borderRadius: 18,
    marginRight: 14,
    // removed large marginTop; keep header compact
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#fff',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: RNStyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.35)',
    overflow: 'hidden',
  },
  tileText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: 0.2,
  },

  /* Location */
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
    marginHorizontal: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  locText: { flex: 1, color: '#fff', fontSize: 14, marginHorizontal: 6 },
  locBold: { fontWeight: '700' },

  /* Banner */
  bannerWrap: { paddingHorizontal: 16, marginTop: 10 },
  bannerNotch: {
    position: 'absolute',
    left: 20,
    top: -3,
    width: 12,
    height: 12,
    backgroundColor: 'tomato',
    transform: [{ rotate: '45deg' }],
  },
  banner: {
    backgroundColor: 'tomato',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  bannerText: { flex: 1, color: '#fff', fontSize: 13, textAlign: 'left' },
  bannerLink: {
    textDecorationLine: 'underline',
    fontWeight: '700',
    color: '#fff',
  },
  bannerClose: { marginLeft: 10 },

  searchInput: { flex: 1, color: '#152032', fontSize: 14, paddingVertical: 0 },

  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: 'tomato',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },

});
