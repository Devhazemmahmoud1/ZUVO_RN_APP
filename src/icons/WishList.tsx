import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const ShoppingBagHeartIcon = ({
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
    <Path d="M11.5 21h-2.926a3 3 0 0 1-2.965-2.544l-1.255-8.152a2 2 0 0 1 1.977-2.304h11.339a2 2 0 0 1 1.977 2.304c-.057.368-.1.644-.127.828" />
    <Path d="M9 11v-5a3 3 0 0 1 6 0v5" />
    <Path d="M18 22l3.35-3.284a2.143 2.143 0 0 0 .005-3.071a2.242 2.242 0 0 0-3.129-.006l-.224.22l-.223-.22a2.242 2.242 0 0 0-3.128-.006a2.143 2.143 0 0 0-.006 3.071l3.355 3.296z" />
  </Svg>
);
