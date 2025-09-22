import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const ShoppingCartIcon = ({
  size = 24,
  color = 'currentColor',
  ...props
}: {
  size?: number;
  color?: string;
} & React.ComponentProps<typeof Svg>) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <Path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M17 17h-11v-14h-2" />
    <Path d="M6 5l14 1l-1 7h-13" />
  </Svg>
);
