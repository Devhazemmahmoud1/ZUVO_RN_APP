import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Modal,
} from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';

const LoadingSpinner = ({
  size = 48,
  color = '#FF6347',
  strokeWidth = 4,
  duration = 800,
  overlay = false,
  text = '',
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [rotateAnim, duration]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const dashArray = `${circumference * 0.25} ${circumference}`;

  const spinnerContent = (
    <View style={styles.centered}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <G>
            <Circle
              cx={cx}
              cy={cy}
              r={radius}
              stroke={color + '33'}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx={cx}
              cy={cy}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={dashArray}
            />
          </G>
        </Svg>
      </Animated.View>
      {text ? <Text style={styles.text}>{text}</Text> : null}
    </View>
  );

  if (overlay) {
    return (
      <Modal
        transparent
        animationType="fade"
        visible
        statusBarTranslucent
      >
        <View style={styles.overlay}>{spinnerContent}</View>
      </Modal>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    // backgroundColor: '#E6E8F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});
