// src/components/BottomProgress.tsx
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

const BAR_W = 80;           // bar chip width
const TRACK_W = 160;        // track container width
const DURATION = 900;       // speed

export default function BottomProgress({ visible }: { visible: boolean }) {
  const tx = useRef(new Animated.Value(-BAR_W)).current;

  useEffect(() => {
    let loop: Animated.CompositeAnimation | undefined;

    if (visible) {
      // slide from left -> right, then jump back and repeat
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(tx, {
            toValue: TRACK_W,
            duration: DURATION,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(tx, {
            toValue: -BAR_W,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
    } else {
      tx.stopAnimation();
      tx.setValue(-BAR_W);
      loop?.stop?.();
    }

    return () => loop?.stop?.();
  }, [visible, tx]);

  if (!visible) return null;

  return (
    <View style={styles.root}>
      <View style={styles.track}>
        <Animated.View style={[styles.bar, { transform: [{ translateX: tx }] }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    bottom: 70,    // just above your Sort/Filter bar
    right: 16,
  },
  track: {
    width: TRACK_W,
    height: 6,
    backgroundColor: "#e7eef6",
    borderRadius: 6,
    overflow: "hidden",
  },
  bar: {
    width: BAR_W,
    height: 6,
    borderRadius: 6,
    backgroundColor: "#0d578f",
  },
});
