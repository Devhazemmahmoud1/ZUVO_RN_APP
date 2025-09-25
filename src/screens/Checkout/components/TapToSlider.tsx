import React, { useRef, useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  Animated,
  LayoutChangeEvent,
  Pressable,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

type Props = {
  label?: string;
  onComplete?: () => void;
  disabled?: boolean;
  style?: any;
  resetAfterComplete?: boolean;          // default true
  durationMs?: number;                   // default 450
  direction?: "rtl" | "ltr";            // rtl = right->left (default), ltr = left->right
};

export default function TapSlideConfirm({
  label = "Slide to confirm",
  onComplete,
  disabled = false,
  style,
  resetAfterComplete = true,
  durationMs = 450,
  direction = "rtl",
}: Props) {
  const HANDLE = 40;
  const TRACK_H = 56;
  const PADDING = 8;

  const [trackW, setTrackW] = useState(0);
  const maxX = Math.max(0, trackW - HANDLE - PADDING * 2);

  // position in px from the LEFT (Animated)
  const x = useRef(new Animated.Value(0)).current;

  // set initial position based on direction after we know width
  useEffect(() => {
    if (trackW === 0) return;
    const start = direction === "rtl" ? maxX : 0; // start on the right for RTL
    x.setValue(start);
  }, [trackW, direction, maxX, x]);

  const onLayoutTrack = (e: LayoutChangeEvent) => {
    setTrackW(e.nativeEvent.layout.width);
  };

  const run = () => {
    if (disabled || trackW === 0) return;
    const start = direction === "rtl" ? maxX : 0;
    const end = direction === "rtl" ? 0 : maxX;

    // ensure we start from the correct edge
    x.setValue(start);

    Animated.timing(x, {
      toValue: end,
      duration: durationMs,
      useNativeDriver: false, // animates "left/width" dependent things
    }).start(({ finished }) => {
      if (finished) {
        onComplete?.();
        if (resetAfterComplete) {
          // slide back to start
          Animated.timing(x, {
            toValue: start,
            duration: 300,
            useNativeDriver: false,
          }).start();
        }
      }
    });
  };

  // progress fill follows the handle (accounting for direction)
  const fillW = x.interpolate({
    inputRange: [0, maxX || 1],
    outputRange:
      direction === "rtl"
        ? [trackW, HANDLE + PADDING * 2] // shrinking from full to handle width
        : [HANDLE + PADDING * 2, (HANDLE + PADDING * 2) + (maxX || 1)],
    extrapolate: "clamp",
  });

  return (
    <Pressable
      onPress={run}
      disabled={disabled}
      style={[styles.track, { height: TRACK_H }, style]}
      onLayout={onLayoutTrack}
      collapsable={false}
    >
      {/* Fill/progress */}
      <Animated.View
        style={[
          styles.fill,
          direction === "rtl" ? styles.fillRTL : null,
          { width: fillW },
        ]}
      />

      {/* Label */}
      <Text pointerEvents="none" style={styles.label}>
        {label}
      </Text>

      {/* Handle */}
      <Animated.View
        style={[
          styles.handle,
          {
            left: PADDING,
            top: (TRACK_H - HANDLE) / 2,
            transform: [{ translateX: x }],
          },
          disabled && { opacity: 0.5 },
        ]}
      >
        <Ionicons
          name={direction === "rtl" ? "arrow-back" : "arrow-forward"}
          size={20}
          color="#fff"
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: 16,
    backgroundColor: "#E9EBF1",
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "tomato",
  },
  // for RTL we want the fill anchored to the RIGHT side
  fillRTL: {
    right: 0,
    left: undefined,
  },
  label: {
    alignSelf: "center",
    color: "#111827",
    fontWeight: "800",
    letterSpacing: 1,
    zIndex: 1,
  },
  handle: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2D6CB5",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
});
