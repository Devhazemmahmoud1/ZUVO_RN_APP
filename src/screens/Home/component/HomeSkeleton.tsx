import React from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const H_PADDING = 16;
const CARD_GAP = 16;
const PRODUCT_CARD_WIDTH = (SCREEN_WIDTH - H_PADDING * 2 - CARD_GAP) / 2;
const CATEGORY_TILE_WIDTH = (SCREEN_WIDTH - H_PADDING * 2) / 4;

const HomeSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SkeletonPlaceholder borderRadius={14}>
          <SkeletonPlaceholder.Item width={180} height={18} marginTop={12} />
          <SkeletonPlaceholder.Item width={SCREEN_WIDTH - H_PADDING * 2} height={14} marginTop={12} />
          <SkeletonPlaceholder.Item
            width={SCREEN_WIDTH - H_PADDING * 2}
            height={44}
            marginTop={24}
            borderRadius={12}
          />
        </SkeletonPlaceholder>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SkeletonPlaceholder borderRadius={16}>
          <SkeletonPlaceholder.Item
            width={SCREEN_WIDTH - H_PADDING * 2}
            height={140}
            borderRadius={16}
          />
        </SkeletonPlaceholder>

        <SkeletonPlaceholder borderRadius={16}>
          <SkeletonPlaceholder.Item
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="space-between"
            marginTop={24}
          >
            {Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonPlaceholder.Item
                key={idx}
                width={CATEGORY_TILE_WIDTH}
                marginTop={idx >= 4 ? 20 : 0}
                alignItems="center"
              >
                <SkeletonPlaceholder.Item width={62} height={62} borderRadius={31} />
                <SkeletonPlaceholder.Item width={48} height={10} marginTop={10} borderRadius={4} />
              </SkeletonPlaceholder.Item>
            ))}
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>

        {[0, 1, 2].map(section => (
          <View key={section} style={styles.section}>
            <SkeletonPlaceholder borderRadius={12}>
              <SkeletonPlaceholder.Item width={160} height={18} />
            </SkeletonPlaceholder>

            <SkeletonPlaceholder borderRadius={16}>
              <SkeletonPlaceholder.Item flexDirection="row" marginTop={16}>
                {Array.from({ length: 2 }).map((_, idx) => (
                  <SkeletonPlaceholder.Item
                    key={idx}
                    width={PRODUCT_CARD_WIDTH}
                    marginRight={idx === 0 ? CARD_GAP : 0}
                  >
                    <SkeletonPlaceholder.Item height={156} borderRadius={16} />
                    <SkeletonPlaceholder.Item width={PRODUCT_CARD_WIDTH * 0.9} height={12} marginTop={14} />
                    <SkeletonPlaceholder.Item width={PRODUCT_CARD_WIDTH * 0.6} height={12} marginTop={10} />
                    <SkeletonPlaceholder.Item width={PRODUCT_CARD_WIDTH * 0.4} height={12} marginTop={10} />
                  </SkeletonPlaceholder.Item>
                ))}
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: H_PADDING,
    backgroundColor: '#2A5B8F',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: H_PADDING,
    paddingBottom: 32,
  },
  section: {
    marginTop: 32,
  },
});

export default HomeSkeleton;
