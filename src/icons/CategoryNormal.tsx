import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

export const CategoryNormalIcon = ({
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
    <Path d="M4 4h6v6h-6z" />
    <Path d="M14 4h6v6h-6z" />
    <Path d="M4 14h6v6h-6z" />
    <Circle cx={17} cy={17} r={3} />
  </Svg>
);
