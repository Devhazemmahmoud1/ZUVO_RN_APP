import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Platform, PermissionsAndroid, TextInput, FlatList, TouchableHighlight } from 'react-native';
import Modal from 'react-native-modal';
import Geolocation from 'react-native-geolocation-service';
import { getPlaceName } from '../../../ultis/getPlaceName';
import LocationIcon from '../../../icons/Location';
import { fetchAutocompletePredictions } from '../../../ultis/fetchPlaces';
import { fetchPlaceDetails } from '../../../ultis/fetchPlaceDetails';
import { t } from 'i18next';
import { useLanguage } from '../../../LanguageProvider';
import { getCairoFont } from '../../../ultis/getFont';

async function requestLocationPermission() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

const MapsView = ({ mapVisible, onCancelMap, navigation, onOpenDetails, editMode = false, lnglat }: any) => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [placeName, setPlaceName] = useState<string>('');
  const [loadingPlaceName, setLoadingPlaceName] = useState(false);
  const [autocompleteResults, setAutocompleteResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { isRTL } = useLanguage()

  useEffect(() => {
    if (mapVisible && editMode === false) {
      (async () => {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
          console.log('Location permission denied');
          return;
        }

        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log('Current position:', position.coords);
            setLocation({ latitude, longitude });
          },
          (error) => {
            console.log('Location error:', error);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      })();
    } else if (editMode === true) {
        setLocation({
            latitude: lnglat.latitude,
            longitude: lnglat.longitude,
        })
    }
  }, [mapVisible, editMode, lnglat]);

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      setLoadingPlaceName(true);
      getPlaceName(location.latitude, location.longitude)
        .then((name) => {
          if (name) setPlaceName(name);
        })
        .finally(() => setLoadingPlaceName(false));
    }
  }, [location]);

    // Handle text input changes for autocomplete
    const onChangeText = async (text: string) => {
        setPlaceName(text);
        if (text.length > 2) {
          const results = await fetchAutocompletePredictions(text);
          setAutocompleteResults(results);
          setShowDropdown(true);
        } else {
          setAutocompleteResults([]);
          setShowDropdown(false);
        }
      };
    
      // When user selects a prediction
      const onSelectPrediction = async (description: string, placeId: string) => {
        setPlaceName(description);
        setShowDropdown(false);
        setAutocompleteResults([]);
        // Optionally, you can call geocoding on the selected description here to get lat/lng

        const details = await fetchPlaceDetails(placeId);
        if (details) {
          console.log(details)
          const { lat, lng } = details.geometry.location;
          setLocation({ latitude: lat, longitude: lng });
          setPlaceName(details.formatted_address || description);
        }

      };

      const handleChooseAddress = () => {
        onOpenDetails()
        navigation.navigate('AddressDetails',{
            address: placeName,
            location: location,
        })
      }

  return (
    <Modal
      isVisible={mapVisible}
      onBackdropPress={onCancelMap}
      coverScreen
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={{ margin: 0 }}
    >
      <View style={styles.fullScreen}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('app')}</Text>
          <TouchableOpacity onPress={onCancelMap}>
            <Text style={styles.cancelText}>{t('cancel')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
        
        <View style={styles.searchContainer}>
            <LocationIcon color='tomato' />
            <TextInput
              style={styles.input}
              value={placeName}
              onChangeText={onChangeText}
              placeholder="Search for a location"
              editable={!loadingPlaceName}
            />
          </View>

          {showDropdown && autocompleteResults.length > 0 && (
            <View style={styles.dropdown}>
              <FlatList
                keyboardShouldPersistTaps="handled"
                data={autocompleteResults}
                keyExtractor={(item) => item.place_id}
                renderItem={({ item }) => (
                  <TouchableHighlight
                    underlayColor="#eee"
                    onPress={() => {
                        onSelectPrediction(item.description, item.place_id);
                    }}
                  >
                    <Text style={styles.dropdownItem}>{item.description}</Text>
                  </TouchableHighlight>
                )}
              />
            </View>
          )}

          {/* Uncomment and use your MapView here when ready */}
          {/* <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: location?.latitude || 37.78825,
              longitude: location?.longitude || -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker coordinate={location} />
          </MapView> */}
        </View>
        <View style={styles.footer}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={handleChooseAddress}
            >
              <Text style={[styles.footerButtonText, isRTL ? getCairoFont('800') : undefined ]}>{t('confirmAddress')}</Text>
            </TouchableOpacity>
          </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50, // space for header
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  cancelText: {
    fontSize: 15,
    color: '#000',
    fontWeight: '400',
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F0FA',
    paddingBottom: 100,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    // borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 5,
    height: 50,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#757171',
    fontWeight: '500',
  },
  dropdown: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  dropdownItem: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: 13,
    fontWeight: 500,
    color: '#333',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  footerButton: {
    backgroundColor: 'tomato',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  footerButtonText: {
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.5,
    fontSize: 13,
  },
});

export default MapsView;
