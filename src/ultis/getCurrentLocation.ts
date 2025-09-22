import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export async function getCurrentPosition(): Promise<{ lat: number; lng: number }> {
  // 1) Ask for permission
  if (Platform.OS === 'ios') {
    const auth = await Geolocation.requestAuthorization('whenInUse'); // 'granted' | 'denied' | 'disabled'
    if (auth === 'disabled') {
      Alert.alert(
        'Location Services disabled',
        'Enable Location Services in Settings to use your current location.',
        [{ text: 'Open Settings', onPress: () => Linking.openSettings() }, { text: 'Cancel' }]
      );
      throw new Error('location-services-disabled');
    }
    if (auth !== 'granted') {
      throw new Error('location-permission-denied');
    }
  } else {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location permission',
        message: 'Your location is used to validate the delivery address.',
        buttonPositive: 'OK',
      }
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      throw new Error('location-permission-denied');
    }
  }

  // 2) Read coordinates
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
        accuracy: { ios: 'best' }, // safe noop on Android
      }
    );
  });
}
