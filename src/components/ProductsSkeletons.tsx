import React from 'react';
import { Dimensions, StyleSheet, View, ViewStyle } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const { width } = Dimensions.get('window');
const H_PADDING = 16;
const GAP = 16;
const ITEM_WIDTH = (width - H_PADDING * 2 - GAP) / 2;

function SkeletonGrid({ count, style }: { count: number; style?: ViewStyle }) {
  const safeCount = Math.max(1, count ?? 1);

  return (
    <View style={[styles.container, style]}>
      <SkeletonPlaceholder borderRadius={12}>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="space-between"
        >
          {Array.from({ length: safeCount }).map((_, idx) => (
            <SkeletonPlaceholder.Item
              key={idx}
              width={ITEM_WIDTH}
              borderRadius={16}
              marginTop={idx >= 2 ? GAP : 0}
            >
              <SkeletonPlaceholder.Item height={140} borderRadius={12} />
              <SkeletonPlaceholder.Item width="85%" height={16} marginTop={12} />
              <SkeletonPlaceholder.Item width="60%" height={14} marginTop={8} />
              <SkeletonPlaceholder.Item width="40%" height={14} marginTop={8} />
            </SkeletonPlaceholder.Item>
          ))}
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
}

export default function ProductListSkeleton() {
  return <SkeletonGrid count={6} style={{ paddingTop: 12 }} />;
}

export function ProductListNextPageSkeleton({ count }: { count: number }) {
  return <SkeletonGrid count={count} style={{ paddingTop: 0 }} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: H_PADDING,
  },
});
