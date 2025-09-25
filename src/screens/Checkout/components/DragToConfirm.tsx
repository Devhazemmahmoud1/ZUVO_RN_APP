import React, { useRef } from "react";
import { View, Text, StyleSheet, Animated, PanResponder, ViewStyle } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

type Props = {
  label?: string;
  onComplete?: () => void;
  disabled?: boolean;
  style?: ViewStyle;

  /** Visuals / sizing */
  travelPx?: number;     // total slider width (px), default 300
  handleSize?: number;   // knob size (px), default 40
  trackHeight?: number;  // bar height (px), default 56
  padding?: number;      // inner horizontal padding (px), default 8

  /** Behavior */
  requireFullEnd?: boolean; // must reach the far end to complete (default true)
  endTolerancePx?: number;  // leeway from the far end in px (default 3)
  resetAfterComplete?: boolean; // spring back to start after complete (default true)

  /** Direction */
  direction?: "ltr" | "rtl"; // LTR = left→right, RTL = right→left (default "ltr")
};

export default function DragToConfirmFixed({
  label = "Slide To Confirm",
  onComplete,
  disabled = false,
  style,

  travelPx = 300,
  handleSize = 40,
  trackHeight = 56,
  padding = 8,

  requireFullEnd = true,
  endTolerancePx = 3,
  resetAfterComplete = true,

  direction = "ltr",
}: Props) {
  // progress is normalized [0..1]: 0 = start side, 1 = far end
  const progress = useRef(new Animated.Value(0)).current;
  const startProgress = useRef(0);

  // actual horizontal travel distance for the handle (never 0)
  const distance = Math.max(10, travelPx - handleSize - padding * 2);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: (_e, g) =>
        !disabled && Math.abs(g.dx) > 4 && Math.abs(g.dx) > Math.abs(g.dy),
      onStartShouldSetPanResponderCapture: () => !disabled,
      onMoveShouldSetPanResponderCapture: (_e, g) =>
        !disabled && Math.abs(g.dx) > Math.abs(g.dy),

      onPanResponderGrant: () => {
        progress.stopAnimation(v => { startProgress.current = v; });
      },

      onPanResponderMove: (_e, g) => {
        // Convert finger movement to normalized progress step
        // LTR: progress increases with +dx
        // RTL: progress increases with -dx (dragging left)
        const dirMult = direction === "rtl" ? -1 : 1;
        const step = (g.dx / distance) * dirMult;
        const next = clamp(startProgress.current + step, 0, 1);
        progress.setValue(next);
      },

      onPanResponderRelease: () => {
        progress.stopAnimation((val: number) => {
          const endTol = endTolerancePx / distance;
          const done = requireFullEnd ? (val >= 1 - endTol) : (val >= 0.9);

          // Snap to end or back to start
          Animated.timing(progress, {
            toValue: done ? 1 : 0,
            duration: 140,
            useNativeDriver: false,
          }).start(() => {
            if (done) {
              onComplete?.();
              if (resetAfterComplete) {
                Animated.spring(progress, {
                  toValue: 0,
                  bounciness: 6,
                  useNativeDriver: false,
                }).start();
              }
            }
          });
        });
      },

      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  // Handle translation:
  // LTR: tx = progress * distance  (start left, move right)
  // RTL: tx = (1 - progress) * distance (start right, move left)
  const txLTR = Animated.multiply(progress, distance);
  const txRTL = Animated.multiply(Animated.subtract(1, progress), distance);
  const tx = direction === "rtl" ? txRTL : txLTR;

  // Progress fill grows from the start side
  const fillBase = handleSize + padding * 2;
  const fillW = Animated.add(Animated.multiply(progress, distance), new Animated.Value(fillBase));

  // Knob arrow icon
  const arrowName = direction === "rtl" ? "arrow-back" : "arrow-forward";

  return (
    <View style={[styles.wrap, style]}>
      <View style={[styles.track, { height: trackHeight, width: travelPx }]}>
        {/* Progress fill anchored from the start side */}
        <Animated.View
          style={[
            styles.fill,
            direction === "rtl" ? { right: 0, width: fillW } : { left: 0, width: fillW },
          ]}
        />

        {/* Label */}
        <Text pointerEvents="none" style={styles.label}>
          {label}
        </Text>

        {/* Drag surface covering the whole bar */}
        <Animated.View
          {...pan.panHandlers}
          style={[styles.touchLayer, { height: trackHeight }]}
        />

        {/* Handle (anchor left in LTR, right in RTL; move via translateX) */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.handle,
            {
              width: handleSize,
              height: handleSize,
              top: (trackHeight - handleSize) / 2,
              opacity: disabled ? 0.5 : 1,
            },
            direction === "rtl"
              ? { right: padding, transform: [{ translateX: Animated.multiply(txLTR, -1) }] }
              : { left:  padding, transform: [{ translateX: txLTR }] },
          ]}
        >
          <Ionicons name={arrowName} size={20} color="#fff" />
        </Animated.View>
      </View>
    </View>
  );
}

/** utils */
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(n, max));
}

/** styles */
const styles = StyleSheet.create({
  // centers the slider in its parent
  wrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  track: {
    borderRadius: 16,
    backgroundColor: "tomato",
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  fill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  label: {
    alignSelf: "center",
    color: "#fff",
    fontWeight: "800",
    letterSpacing: 1,
    zIndex: 1,
  },
  touchLayer: {
    position: "absolute",
    left: 0, right: 0, top: 0, bottom: 0,
    zIndex: 3,
  },
  handle: {
    position: "absolute",
    backgroundColor: "#2D6CB5",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 4,
    elevation: 3,
  },
});
