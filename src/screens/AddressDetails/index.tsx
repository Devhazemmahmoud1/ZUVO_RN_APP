import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
} from 'react-native';
import CountyModel from '../../components/CountryModel';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { addressSchema } from '../../validation/addressSchema';
import OTPModal from '../../components/OTPModel';
import LoadingSpinner from '../../components/Loading';
import MapsView from '../Addresses/components/MapView';
import { useAddAddress, useEditAddress } from '../../apis/addressApi';
import { t } from 'i18next';
import { useLanguage } from '../../LanguageProvider';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
// import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const AddressDetails = ({ route, navigation }: any) => {
  const { address, location, incomingData } = route.params || {};
  const [modalVisible, setModalVisible] = useState(false);
  const [oldPhone] = useState('');
  const [openMap, setOpenMap] = useState(false);
  const { mutate: addAddress, isPending: adding } = useAddAddress()
  const { mutate: editAddress, isPending: editing } = useEditAddress() 

  const { isRTL } = useLanguage()

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(addressSchema),
    defaultValues: {
      additionalAddress:
        (incomingData && incomingData?.additionalAddress) || '',
      mobileNumber: (incomingData && incomingData.mobile) || '',
      firstName: (incomingData && incomingData.firstName) || '',
      lastName: (incomingData && incomingData.lastName) || '',
    },
  });

  const onSubmit = data => {

    console.log('this is the data', data)

    if (incomingData) {
      if (data.mobile_number === oldPhone) {
        // Phone number changed — open modal
        // setModalVisible(true);
      } else {
        editAddress({
          id: incomingData.id,
          firstName: data.firstName,
          lastName: data.lastName,
          mobileNumber: data.mobileNumber,
          additionalAddress: data.additionalAddress,
          address: address,
          location: location,
        })
        
          navigation.navigate('AppTabs', {
            screen: 'AccountStack',
            params: {
              screen: 'Account',
              params: { addressOpen: true },
            },
          });
      }
    } else {
      if (data.mobile_number === oldPhone) {
        // Phone number changed — open modal
        // setModalVisible(true);
      } else {
        addAddress({
          firstName: data.firstName,
          lastName: data.lastName,
          mobileNumber: data.mobileNumber,
          additionalAddress: data.additionalAddress,
          address: address,
          location: location,
        }, {
          onSuccess: () => {
            navigation.navigate('AppTabs', {
              screen: 'AccountStack',
              params: {
                screen: 'Account',
                params: { addressOpen: true },
              },
            });
          }
        })
      }
    }
  };

  const handleEditMap = () => {
    setOpenMap(true);
  };

  console.log(errors);

  return (
    <>
      {openMap && (
        <MapsView
          mapVisible={openMap}
          editMode={true}
          lnglat={location}
          onCancelMap={() => setOpenMap(false)}
          onOpenDetails={() => setOpenMap(false)}
          navigation={navigation}
        />
      )}
      {(adding || editing) && <LoadingSpinner overlay />}
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../../../src/assets/main_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>{t('cancel')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Location Information */}
          <Text style={styles.sectionHeader}>{t('locationInfo')}</Text>

          {/* Address Row */}
          <View style={styles.row}>
            <View style={styles.addressTextContainer}>
              <Text style={styles.addressText}>{address}</Text>
            </View>
            <TouchableOpacity
              style={styles.mapBox}
              onPress={() => {
                /* handle edit location */
              }}
            >
              <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.mapPreview}
              initialRegion={{
                latitude: location?.latitude || 25.2048,
                longitude: location?.longitude || 55.2708,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              pointerEvents="none"
            >
              {location && (
                <Marker coordinate={location} />
              )}
            </MapView>
              <Pressable
                style={styles.editOverlay}
                onPress={() => handleEditMap()}
              >
                <Text style={styles.editText}>{t('edit')}</Text>
              </Pressable>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Additional Address Details */}
          <Text style={styles.sectionHeader}>{t('addAddressDetails')}</Text>
          <Controller
            control={control}
            name="additionalAddress"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder={t('dropPackage')}
                style={[
                  [styles.input, isRTL ? { textAlign: 'right'} : undefined],
                  errors.mobileNumber ? styles.inputError : null,
                ]}
                placeholderTextColor="#737070"
                value={value ?? ''}
                onChangeText={onChange}
              />
            )}
          />

          {/* Personal Information */}
          <Text style={styles.sectionHeader}>{t('personalInfo')}</Text>

          <View style={styles.countryView}>
            <Text style={styles.inputLabel}>{t('mobileNumber')}</Text>
            <CountyModel
              onChange={(arg1, arg2) => {
                setValue('mobileNumber', arg1.country.dial_code + '' + arg2);
              }}
            />
          </View>

          <Text style={styles.inputLabel}>{ t('firstName') }</Text>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder={t('firstName')}
                style={[
                  styles.input, isRTL ? { textAlign: 'right'} : undefined,
                  errors.firstName ? styles.inputError : null,
                ]}
                placeholderTextColor="#737070"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          <Text style={styles.inputLabel}>{t('lastName')}</Text>
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder={t('lastName')}
                style={[
                  styles.input, isRTL ? { textAlign: 'right'} : undefined,
                  errors.lastName ? styles.inputError : null,
                ]}
                placeholderTextColor="#737070"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.saveButtonText}>{t('saveAddress')}</Text>
          </TouchableOpacity>
        </ScrollView>

        <OTPModal
          makeOTPVisible={modalVisible}
          setMakeOTPVisible={setModalVisible}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  countryView: {
    marginBottom: 35,
  },
  scrollContent: {
    paddingVertical: 10,
    paddingHorizontal: 20,
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
  sectionHeader: {
    textAlign: 'left',
    fontSize: 16,
    fontWeight: '700',
    color: '#7D7C7C',
    marginVertical: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 40,
    // marginBottom: 15,
  },
  addressTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  addressText: {
    fontSize: 14,
    color: '#000',
    fontWeight: 600,
  },
  mapBox: {
    width: 100,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  mapPreview: {
    flex: 1,
  },
  editOverlay: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  editText: {
    color: '#fff',
    fontSize: 10,
  },
  input: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#DBD9D9', // bottom border color
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    paddingVertical: 5,
    marginBottom: 20,
    fontWeight: 500,
    color: '#000',
    fontSize: 14,
  },
  inputError: {
    borderBottomColor: 'red',
  },
  saveButton: {
    backgroundColor: 'tomato',
    padding: 15,
    // borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#DBD9D9',
    marginVertical: 16,
    marginBottom: 15,
    marginTop: 30,
  },
  inputLabel: {
    textAlign: 'left',
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
    fontWeight: '500',
  },
  logo: {
    width: 50, 
    height: 50
  }
});

export default AddressDetails;
