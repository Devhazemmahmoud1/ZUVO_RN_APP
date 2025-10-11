import React from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const H_PADDING = 12;
const CARD_GAP = 16;
const CARD_WIDTH = (SCREEN_WIDTH - H_PADDING * 2 - CARD_GAP) / 2;

export default function WishlistSkeleton() {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder borderRadius={12}>
        <SkeletonPlaceholder.Item width={180} height={24} marginTop={24} marginHorizontal={16} />
        <SkeletonPlaceholder.Item width={120} height={16} marginTop={12} marginHorizontal={16} />
      </SkeletonPlaceholder>

      <SkeletonPlaceholder borderRadius={12}>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="space-between"
          marginTop={24}
          marginHorizontal={16}
        >
          <SkeletonPlaceholder.Item width={120} height={18} />
          <SkeletonPlaceholder.Item width={90} height={18} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SkeletonPlaceholder borderRadius={16}>
          <SkeletonPlaceholder.Item flexDirection="row" flexWrap="wrap" justifyContent="space-between">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonPlaceholder.Item
                key={idx}
                width={CARD_WIDTH}
                marginTop={idx >= 2 ? CARD_GAP : 0}
                borderRadius={16}
                padding={12}
              >
                <SkeletonPlaceholder.Item width={CARD_WIDTH - 24} height={140} borderRadius={12} />
                <SkeletonPlaceholder.Item width={CARD_WIDTH - 40} height={16} marginTop={12} />
                <SkeletonPlaceholder.Item width={CARD_WIDTH - 60} height={14} marginTop={8} />
                <SkeletonPlaceholder.Item width={CARD_WIDTH - 80} height={14} marginTop={8} />
                <SkeletonPlaceholder.Item width={CARD_WIDTH - 120} height={32} marginTop={16} borderRadius={16} />
              </SkeletonPlaceholder.Item>
            ))}
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: H_PADDING,
    paddingVertical: 20,
    paddingBottom: 120,
  },
});
