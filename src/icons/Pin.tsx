import React from 'react';
import Svg, { Path } from 'react-native-svg';

const Pin = ({ size = 24, color = 'tomato' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    pointerEvents="none"
  >
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" />
  </Svg>
);

export default Pin;
