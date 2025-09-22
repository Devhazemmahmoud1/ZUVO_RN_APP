import * as React from "react";
import Svg, { Path } from "react-native-svg";

export default function ArrowLeftIcon({ size = 24, color = "currentColor", ...props }) {
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
      <Path d="M5 12l14 0" />
      <Path d="M5 12l4 4" />
      <Path d="M5 12l4 -4" />
    </Svg>
  );
}
