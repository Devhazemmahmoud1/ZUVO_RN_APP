import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export default function CheckoutSkeleton() {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder borderRadius={12}>
        <SkeletonPlaceholder.Item width={200} height={24} marginTop={24} marginHorizontal={16} />
      </SkeletonPlaceholder>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {Array.from({ length: 3 }).map((_, idx) => (
          <SkeletonPlaceholder key={idx} borderRadius={16}>
            <SkeletonPlaceholder.Item
              marginTop={idx === 0 ? 0 : 20}
              marginHorizontal={16}
              padding={16}
              borderRadius={16}
            >
              <SkeletonPlaceholder.Item width={140} height={18} />
              <SkeletonPlaceholder.Item width="90%" height={14} marginTop={16} />
              <SkeletonPlaceholder.Item width="80%" height={14} marginTop={10} />
              <SkeletonPlaceholder.Item width="70%" height={14} marginTop={10} />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        ))}

        <SkeletonPlaceholder borderRadius={16}>
          <SkeletonPlaceholder.Item marginTop={24} marginHorizontal={16} padding={16} borderRadius={16}>
            <SkeletonPlaceholder.Item width={160} height={18} />
            {Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonPlaceholder.Item
                key={idx}
                width="60%"
                height={14}
                marginTop={idx === 0 ? 16 : 12}
              />
            ))}
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>

        <SkeletonPlaceholder borderRadius={50}>
          <SkeletonPlaceholder.Item
            width={200}
            height={50}
            borderRadius={25}
            alignSelf="center"
            marginTop={40}
          />
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
    paddingBottom: 120,
  },
});
