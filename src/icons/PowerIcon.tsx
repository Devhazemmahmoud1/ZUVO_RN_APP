import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const PowerIcon = ({ color = 'black', size = 24, ...props }) => (
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
    {/* Optional background path — can be removed */}
    {/* <Path d="M0 0h24v24H0z" fill="none" stroke="none" /> */}

    {/* Arc (semi-circle-ish) — replaced elliptical arc with Bezier curves */}
    <Path d="M7 6c-1.5 1.5 -2.25 3.25 -2.25 6s.75 4.5 2.25 6c1.5 1.5 3.25 2.25 5 2.25s3.5-.75 5-2.25c1.5-1.5 2.25-3.25 2.25-6s-.75-4.5-2.25-6" />

    {/* Vertical power line */}
    <Path d="M12 4v8" />
  </Svg>
);
