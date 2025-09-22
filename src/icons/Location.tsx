import React from 'react';
import Svg, { Path } from 'react-native-svg';

// Location Icon
const LocationIcon = ({ size = 20, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
      fill={color}
    />
  </Svg>
);

export default LocationIcon;