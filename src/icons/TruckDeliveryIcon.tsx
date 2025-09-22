import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface TruckDeliveryIconProps {
  size?: number;
  color?: string;
}

export const TruckDeliveryIcon: React.FC<TruckDeliveryIconProps> = ({
  size = 24,
  color = 'black',
}) => (
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
    <Path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M5 17h-2v-4m-1-8h11v12m-4 0h6m4 0h2v-6h-8m0-5h5l3 5" />
    <Path d="M3 9l4 0" />
  </Svg>
);
