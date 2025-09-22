import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const EditIcon = (props: any) => (
  <Svg
    width={props.size || 24}
    height={props.size ||  24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <Path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
    <Path d="M13.5 6.5l4 4" />
  </Svg>
);