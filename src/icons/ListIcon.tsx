import * as React from "react";
import Svg, { Path } from "react-native-svg";

export default function ListIcon({ size = 24, color = "currentColor", ...props }) {
  return (
    <Svg
    //   xmlns="http://www.w3.org/2000/svg"
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
      <Path d="M9 6l11 0" />
      <Path d="M9 12l11 0" />
      <Path d="M9 18l11 0" />
      <Path d="M5 6l0 .01" />
      <Path d="M5 12l0 .01" />
      <Path d="M5 18l0 .01" />
    </Svg>
  );
}
