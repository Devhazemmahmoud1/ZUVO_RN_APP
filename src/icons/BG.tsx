import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLG, Stop, Rect } from 'react-native-svg';

export function GradientBg({ style }: { style?: ViewStyle }) {
  return (
    <View style={style} pointerEvents="none">
      <Svg width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <SvgLG id="bg" x1="20%" y1="0%" x2="80%" y2="100%">
            <Stop offset="0%" stopColor="#103B66" />
            <Stop offset="60%" stopColor="#2A5B8F" />
            <Stop offset="100%" stopColor="#4D7AA8" />
          </SvgLG>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#bg)" />
      </Svg>
    </View>
  );
}