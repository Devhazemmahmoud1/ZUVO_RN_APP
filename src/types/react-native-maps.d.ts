declare module 'react-native-maps' {
  import * as React from 'react';
  import { ViewProps, StyleProp, ViewStyle } from 'react-native';

  export const PROVIDER_GOOGLE: any;

  export interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }

  export interface MapViewProps extends ViewProps {
    provider?: any;
    style?: StyleProp<ViewStyle>;
    initialRegion?: Region;
    region?: Region;
    onRegionChangeComplete?: (region: Region) => void;
  }

  export default class MapView extends React.Component<MapViewProps> {}

  export interface MarkerProps {
    coordinate: { latitude: number; longitude: number };
    draggable?: boolean;
    onDragEnd?: (e: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => void;
  }
  export class Marker extends React.Component<MarkerProps> {}
}

