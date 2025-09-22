import React from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const { width } = Dimensions.get("window");
const itemWidth = (width - 48) / 2; // 2 items per row with padding

export default function ProductListSkeleton() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    >
      <SkeletonPlaceholder borderRadius={8}>
        {/* Repeat for however many items you want to fake */}
        <View style={styles.grid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <View key={i} style={styles.card}>
              <View style={{ width: "100%", height: 120 }} /> {/* Image */}
              <View style={{ marginTop: 8, width: "80%", height: 16 }} /> {/* Title */}
              <View style={{ marginTop: 6, width: "50%", height: 16 }} /> {/* Price */}
            </View>
          ))}
        </View>
      </SkeletonPlaceholder>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: itemWidth,
    marginBottom: 16,
  },
});
