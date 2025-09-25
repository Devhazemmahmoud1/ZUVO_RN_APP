import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  LayoutChangeEvent,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

type Props = {
  label?: string;
  onComplete?: () => void;
  disabled?: boolean;
  style?: any;
  resetAfterComplete?: boolean; // default true
};

export default function SlideToPay({
  label = "Slide to confirm",
  onComplete,
  disabled = false,
  style,
  resetAfterComplete = true,
}: Props) {
  const HANDLE = 40;
  const TRACK_H = 56;
  const PADDING = 8;

  const [trackW, setTrackW] = useState(0);
  const maxX = Math.max(0, trackW - HANDLE - PADDING * 2);

  const x = useRef(new Animated.Value(0)).current;
  const startX = useRef(0);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onStartShouldSetPanResponderCapture: () => !disabled,
      onMoveShouldSetPanResponder: (_e, g) =>
        !disabled && (Math.abs(g.dx) > 4 && Math.abs(g.dx) > Math.abs(g.dy)),
      onMoveShouldSetPanResponderCapture: (_e, g) =>
        !disabled && Math.abs(g.dx) > Math.abs(g.dy),

      onPanResponderGrant: () => {
        x.stopAnimation((v) => { startX.current = v; });
      },

      onPanResponderMove: (_e, g) => {
        const nx = clamp(startX.current + g.dx, 0, maxX);
        x.setValue(nx);
      },

      onPanResponderRelease: () => {
        x.stopAnimation((val: number) => {
          if (val >= maxX * 0.9) {
            // snap to end
            Animated.timing(x, {
              toValue: maxX,
              duration: 120,
              useNativeDriver: false,
            }).start(() => {
              onComplete?.();
              if (resetAfterComplete) {
                setTimeout(() => {
                  Animated.spring(x, {
                    toValue: 0,
                    bounciness: 6,
                    useNativeDriver: false,
                  }).start();
                }, 150);
              }
            });
          } else {
            // snap back
            Animated.spring(x, {
              toValue: 0,
              bounciness: 6,
              useNativeDriver: false,
            }).start();
          }
        });
      },

      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  const onLayoutTrack = (e: LayoutChangeEvent) => {
    setTrackW(e.nativeEvent.layout.width);
  };

  // fill width follows handle progress
  const fillW = x.interpolate({
    inputRange: [0, maxX || 1],
    outputRange: [HANDLE + PADDING * 2, (HANDLE + PADDING * 2) + (maxX || 1)],
    extrapolate: "clamp",
  });

  return (
    <View style={[styles.track, { height: TRACK_H }, style]} onLayout={onLayoutTrack}>
      {/* Progress fill */}
      <Animated.View style={[styles.fill, { width: fillW }]} />

      {/* Center label on top; ignore touches */}
      <Text pointerEvents="none" style={styles.label}>
        {label}
      </Text>

      {/* Handle */}
      <Animated.View
        {...pan.panHandlers}
        style={[
          styles.handle,
          { left: PADDING, top: (TRACK_H - HANDLE) / 2, transform: [{ translateX: x }] },
          disabled && { opacity: 0.5 },
        ]}
      >
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </Animated.View>
    </View>
  );
}

function clamp(n: number, min: number, max: number) {
    "worklet";
    return Math.max(min, Math.min(n, max));
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
    label: {
      alignSelf: "center",
      color: "#fff",
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