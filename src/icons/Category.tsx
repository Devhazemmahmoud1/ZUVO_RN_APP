import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const CategoryIcon = ({ color = 'black', size = 24, ...props }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    stroke={color}
    fill="none"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Optional background reset — not required in React Native */}
    {/* <Path d="M0 0h24v24H0z" fill="none" stroke="none" /> */}

    {/* Top-left square */}
    <Path d="M4 4h6v6h-6z" />

    {/* Top-right square */}
    <Path d="M14 4h6v6h-6z" />

    {/* Bottom-left square */}
    <Path d="M4 14h6v6h-6z" />

    {/* Plus sign (bottom-right) */}
    <Path d="M14 17h6" />
    <Path d="M17 14v6" />
  </Svg>
);
