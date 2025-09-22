import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
  I18nManager,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Layout tuning
const PEEK = 20;          // visible edge of prev/next card
const GAP  = 12;          // spacing between cards
const CARD_H = 140;
const RADIUS = 16;
const AUTO_MS = 3500;

type Banner = { id: string; title?: string; img?: string; color?: string };
type Props = { data: Banner[]; onPressBanner?: (b: Banner) => void };

export default function BannerCarousel({ data, onPressBanner }: Props) {
  const length = data?.length ?? 0;
  const hasLoop = length > 1;

  const CARD_W = SCREEN_WIDTH - PEEK * 2;
  const STRIDE = CARD_W + GAP;
  const MIDDLE_OFFSET = length * STRIDE;

  // triple the data for seamless looping
  const LOOP = useMemo(
    () => (hasLoop ? [...data, ...data, ...data] : data ?? []),
    [data, hasLoop]
  );

  const listRef = useRef<FlatList>(null);
  const [mounted, setMounted] = useState(false);
  const [loopIndex, setLoopIndex] = useState(Math.max(length, 0));

  // jump to middle copy once list is mounted
  useEffect(() => {
    if (!hasLoop) return;
    const id = setTimeout(() => {
      listRef.current?.scrollToOffset({ offset: MIDDLE_OFFSET, animated: false });
      setMounted(true);
    }, 0);
    return () => clearTimeout(id);
  }, [hasLoop, MIDDLE_OFFSET]);

  // autoplay
  useEffect(() => {
    if (!mounted || !hasLoop) return;
    const id = setInterval(() => {
      const next = (loopIndex + 1) % length; // 👈 wrap around base length
      const target = length + next;          // 👈 always recenter into middle copy
      let offset = target * STRIDE;
  
      if (I18nManager.isRTL) {
        const contentW = STRIDE * LOOP.length;
        offset = contentW - offset - STRIDE;
      }
  
      listRef.current?.scrollToOffset({ offset, animated: true });
      setLoopIndex(target); // 👈 keep state in middle section
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [mounted, hasLoop, loopIndex, STRIDE, LOOP.length, length]);

  // normalize index and recenter into middle copy
  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    let x = e.nativeEvent.contentOffset.x;
  
    // 👇 Flip offset in RTL so math stays consistent
    if (I18nManager.isRTL) {
      const contentW = STRIDE * LOOP.length;
      x = contentW - x - STRIDE; // mirror the position
    }
  
    const i = Math.round(x / STRIDE);
    setLoopIndex(i);
  
    if (!hasLoop) return;
  
    if (i < length) {
      const normalized = (i % length + length) % length;
      const target = length + normalized;
      requestAnimationFrame(() =>
        listRef.current?.scrollToOffset({ offset: target * STRIDE, animated: false })
      );
      setLoopIndex(target);
    } else if (i >= length * 2) {
      const normalized = i % length;
      const target = length + normalized;
      requestAnimationFrame(() =>
        listRef.current?.scrollToOffset({ offset: target * STRIDE, animated: false })
      );
      setLoopIndex(target);
    }
  };

  const renderItem = ({ item }: { item: Banner }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPressBanner?.(item)}
      style={[
        { width: CARD_W, marginRight: GAP },
        I18nManager.isRTL && { transform: [{ scaleX: -1 }] },
      ]}
    >
      <View style={styles.cardShadow}>
        <View style={[styles.card, { height: CARD_H, borderRadius: RADIUS }]}>
          {item.img ? (
            <ImageBackground source={item.img as any} style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: item.color ?? '#E8EEF6' }]} />
          )}
          {item.title ? <Text style={styles.bannerText}>{item.title}</Text> : null}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (length === 0) return null;

  return (
    <View>
      <FlatList
  ref={listRef}
  data={LOOP}
  keyExtractor={(item, i) => `${item.id}-${i}`}
  renderItem={({ item }) => (
    <View style={I18nManager.isRTL && { transform: [{ scaleX: -1 }] }}>
      {renderItem({ item })}
    </View>
  )}
  horizontal
  showsHorizontalScrollIndicator={false}
  pagingEnabled={false}
  decelerationRate="fast"
  snapToInterval={STRIDE}
  snapToAlignment="start"
  contentContainerStyle={{ paddingHorizontal: PEEK }}
  onMomentumScrollEnd={onMomentumEnd}
  getItemLayout={(_, i) => ({ length: STRIDE, offset: STRIDE * i, index: i })}
  // 👇 flip list only in RTL
  style={I18nManager.isRTL && { transform: [{ scaleX: -1 }] }}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  card: {
    overflow: 'hidden',
    backgroundColor: '#E8EEF6',
  },
  bannerText: {
    position: 'absolute',
    left: 16,
    bottom: 12,
    fontSize: 18,
    fontWeight: '700',
    color: '#152032',
  },
});
