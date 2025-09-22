import React from 'react';
import Svg, { Path } from 'react-native-svg';

type SearchIconProps = {
  size?: number;
  color?: string;
};

export const SearchIcon: React.FC<SearchIconProps> = ({
  size = 24,
  color = 'currentColor',
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
    <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <Path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
    <Path d="M21 21l-6 -6" />
  </Svg>
);