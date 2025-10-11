import React from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTENT_PADDING = 16;
const HERO_HEIGHT = Math.round(SCREEN_WIDTH * 0.78);

export default function SingleProductSkeleton() {
  return (
    <View style={styles.screen}>
      {/* Top action bar */}
      <View style={styles.topBar}>
        <SkeletonPlaceholder borderRadius={14}>
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <SkeletonPlaceholder.Item width={36} height={36} borderRadius={12} />
            <SkeletonPlaceholder.Item
              flex={1}
              height={36}
              marginLeft={12}
              marginRight={12}
              borderRadius={12}
            />
            <SkeletonPlaceholder.Item width={36} height={36} borderRadius={12} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero carousel */}
        <View style={styles.hero}>
          <SkeletonPlaceholder borderRadius={0}>
            <SkeletonPlaceholder.Item
              width={SCREEN_WIDTH}
              height={HERO_HEIGHT}
              borderRadius={0}
            />
          </SkeletonPlaceholder>
        </View>

        {/* Title & price block */}
        <View style={styles.section}>
          <SkeletonPlaceholder borderRadius={12}>
            <SkeletonPlaceholder.Item width={220} height={22} />
            <SkeletonPlaceholder.Item width={180} height={18} marginTop={10} />
            <SkeletonPlaceholder.Item flexDirection="row" marginTop={18} alignItems="center">
              <SkeletonPlaceholder.Item width={120} height={26} borderRadius={10} />
              <SkeletonPlaceholder.Item width={80} height={18} marginLeft={12} />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item flexDirection="row" marginTop={18}>
              <SkeletonPlaceholder.Item width={80} height={24} borderRadius={20} />
              <SkeletonPlaceholder.Item width={80} height={24} marginLeft={12} borderRadius={20} />
              <SkeletonPlaceholder.Item width={80} height={24} marginLeft={12} borderRadius={20} />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        </View>

        {/* Rating & shipping info */}
        <View style={styles.section}>
          <SkeletonPlaceholder borderRadius={12}>
            <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
              <SkeletonPlaceholder.Item width={120} height={18} />
              <SkeletonPlaceholder.Item width={80} height={16} marginLeft={12} />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item width={260} height={16} marginTop={10} />
            <SkeletonPlaceholder.Item width={180} height={16} marginTop={8} />
          </SkeletonPlaceholder>
        </View>

        {/* Description block */}
        <View style={styles.section}>
          <SkeletonPlaceholder borderRadius={12}>
            <SkeletonPlaceholder.Item width={140} height={20} />
            {Array.from({ length: 5 }).map((_, idx) => (
              <SkeletonPlaceholder.Item
                key={idx}
                width={SCREEN_WIDTH - CONTENT_PADDING * 2 - 20}
                height={14}
                marginTop={idx === 0 ? 16 : 10}
              />
            ))}
          </SkeletonPlaceholder>
        </View>

        {/* Specs grid */}
        <View style={styles.section}>
          <SkeletonPlaceholder borderRadius={12}>
            <SkeletonPlaceholder.Item width={160} height={20} />
            {Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonPlaceholder.Item
                key={idx}
                flexDirection="row"
                justifyContent="space-between"
                marginTop={idx === 0 ? 18 : 12}
              >
                <SkeletonPlaceholder.Item width={140} height={16} />
                <SkeletonPlaceholder.Item width={120} height={16} />
              </SkeletonPlaceholder.Item>
            ))}
          </SkeletonPlaceholder>
        </View>

        {/* Recommendation cards */}
        <View style={[styles.section, styles.recommendations]}>
          <SkeletonPlaceholder borderRadius={16}>
            <SkeletonPlaceholder.Item width={200} height={20} />
            <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" marginTop={20}>
              {Array.from({ length: 3 }).map((_, idx) => (
                <SkeletonPlaceholder.Item key={idx} width={(SCREEN_WIDTH - CONTENT_PADDING * 2 - 24) / 3}>
                  <SkeletonPlaceholder.Item height={110} borderRadius={12} />
                  <SkeletonPlaceholder.Item width="80%" height={14} marginTop={8} />
                  <SkeletonPlaceholder.Item width="60%" height={12} marginTop={6} />
                </SkeletonPlaceholder.Item>
              ))}
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={styles.ctaWrap}>
        <SkeletonPlaceholder borderRadius={32}>
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <SkeletonPlaceholder.Item width={80} height={18} />
            <SkeletonPlaceholder.Item width={140} height={46} borderRadius={24} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    paddingHorizontal: CONTENT_PADDING,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 120,
  },
  section: {
    paddingHorizontal: CONTENT_PADDING,
    marginTop: 24,
  },
  hero: {
    marginBottom: 24,
  },
  recommendations: {
    marginBottom: 24,
  },
  ctaWrap: {
    position: 'absolute',
    left: CONTENT_PADDING,
    right: CONTENT_PADDING,
    bottom: CONTENT_PADDING,
  },
});
