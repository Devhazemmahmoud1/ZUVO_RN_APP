import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

export const RightArrow = ({ size = 24, color = 'currentColor' }: Props) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M5 12l14 0" />
    <Path d="M15 16l4 -4" />
    <Path d="M15 8l4 4" />
  </Svg>
);

export default RightArrow;
