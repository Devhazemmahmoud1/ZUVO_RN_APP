// components/AEDSymbol.tsx
import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type Props = {
  size?: number;           // height/width in px
  color?: string;          // inherit from text color or set a brand color
  style?: StyleProp<ViewStyle>;
};

export default function AEDSymbol({ size = 16, color = '#111', style }: Props) {
  return (
    <View style={style}>
      <Svg width={size} height={size} viewBox="0 0 256 256">
        {/* Replace the path data with the official path from the guideline SVG */}
        <Path
          d="M..." // <- paste the official symbol's path here
          fill={color}
        />
        {/* If the official mark has the two horizontal bars as separate paths, include them too */}
      </Svg>
    </View>
  );
}
