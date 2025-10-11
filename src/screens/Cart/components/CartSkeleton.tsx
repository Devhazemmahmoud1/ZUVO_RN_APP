import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export default function CartSkeleton() {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder borderRadius={12}>
        <SkeletonPlaceholder.Item width={220} height={26} marginTop={24} marginHorizontal={16} />
      </SkeletonPlaceholder>

      <SkeletonPlaceholder borderRadius={12}>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          marginTop={24}
          marginHorizontal={16}
        >
          <SkeletonPlaceholder.Item width={24} height={24} borderRadius={12} />
          <SkeletonPlaceholder.Item width={220} height={16} marginLeft={12} />
          <SkeletonPlaceholder.Item width={24} height={24} borderRadius={12} marginLeft={12} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {Array.from({ length: 3 }).map((_, idx) => (
          <SkeletonPlaceholder key={idx} borderRadius={16}>
            <SkeletonPlaceholder.Item
              marginTop={idx === 0 ? 0 : 16}
              padding={16}
              backgroundColor="#fff"
              borderRadius={16}
            >
              <SkeletonPlaceholder.Item flexDirection="row">
                <SkeletonPlaceholder.Item width={80} height={80} borderRadius={12} />
                <SkeletonPlaceholder.Item marginLeft={16} flex={1}>
                  <SkeletonPlaceholder.Item width="80%" height={16} />
                  <SkeletonPlaceholder.Item width="60%" height={14} marginTop={8} />
                  <SkeletonPlaceholder.Item width="40%" height={14} marginTop={8} />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                flexDirection="row"
                justifyContent="space-between"
                marginTop={20}
              >
                <SkeletonPlaceholder.Item width={80} height={32} borderRadius={16} />
                <SkeletonPlaceholder.Item width={60} height={32} borderRadius={16} />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        ))}
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
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
});
