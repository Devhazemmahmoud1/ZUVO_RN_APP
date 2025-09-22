import React from 'react';
import Svg, { Path } from 'react-native-svg';
export const HomeIcon = ({ color = "black", size = 24, ...props }) => (
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
    {/* Safe to remove this background reset */}
    {/* <Path d="M0 0h24v24H0z" fill="none" stroke="none" /> */}

    {/* Main smart home shape — converted to be React Native compatible */}
    <Path d="M19 8.71 L13.667 4.562 C12.99 4.041 12.01 4.041 11.333 4.562 L6 8.71 C5.379 9.184 5 9.942 5 10.75 V17.95 C5 19.084 5.896 20 7 20 H17 C18.104 20 19 19.084 19 17.95 V10.75 C19 9.942 18.621 9.184 18 8.71 Z" />

    {/* Bottom curved "mouth" */}
    <Path d="M16 15 C13.79 16.333 10.208 16.333 8 15" />
  </Svg>
  );