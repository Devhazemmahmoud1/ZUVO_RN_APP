import React from 'react';
import Svg, {  Rect, Line } from 'react-native-svg';

const SortingIcon = (props: any) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Rect x={4} y={8} width={4} height={4} />
    <Line x1={6} y1={4} x2={6} y2={8} />
    <Line x1={6} y1={12} x2={6} y2={20} />
    <Rect x={10} y={14} width={4} height={4} />
    <Line x1={12} y1={4} x2={12} y2={14} />
    <Line x1={12} y1={18} x2={12} y2={20} />
    <Rect x={16} y={5} width={4} height={4} />
    <Line x1={18} y1={4} x2={18} y2={5} />
    <Line x1={18} y1={9} x2={18} y2={20} />
  </Svg>
);

export default SortingIcon;
