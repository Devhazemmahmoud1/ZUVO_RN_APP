import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const ReturnIcon = ({
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
    <Path d="M15 14l4-4l-4-4" />
    <Path d="M19 10h-11a4 4 0 1 0 0 8h1" />
  </Svg>
);
