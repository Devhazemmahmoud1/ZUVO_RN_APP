import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ShoppingCartPlusIconProps {
  size?: number;
  color?: string;
}

export const ShoppingCartPlusIcon: React.FC<ShoppingCartPlusIconProps> = ({
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
    <Path d="M4 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <Path d="M12.5 17h-6.5v-14h-2" />
    <Path d="M6 5l14 1l-.86 6.017m-2.64 .983h-10.5" />
    <Path d="M16 19h6" />
    <Path d="M19 16v6" />
  </Svg>
);
