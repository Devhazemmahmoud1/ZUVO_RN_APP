import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { countries } from '../ultis/countries'; // your JSON file
import { useLanguage } from '../LanguageProvider';
import { t } from 'i18next';

const CountyModel = ({ onChange }: any) => {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [search, setSearch] = useState('');
  const {isRTL} = useLanguage()

  const filteredCountries = countries.filter(
    item =>
      item.country.toLowerCase().includes(search.toLowerCase()) ||
      item.dial_code.includes(search),
  );

  const handleSelectCountry = (country: any) => {
    setSearch('');
    setSelectedCountry(country);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Left section: Country code */}
      <TouchableOpacity
        style={styles.countryBox}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.countryText}>{selectedCountry.dial_code}</Text>
      </TouchableOpacity>

      {/* Right section: Phone input */}
      <TextInput
        style={[styles.input, isRTL ? { textAlign: 'right'} : undefined, phoneNumber === '' ? styles.inputError : null]}   
        keyboardType="numeric" 
        placeholder={t('enterPhoneNumber')}
        placeholderTextColor="#737070"
        value={phoneNumber}
        onChangeText={text => {
          const numericText = text.replace(/[^0-9]/g, '');
          setPhoneNumber(numericText);
          if (onChange) onChange({ country: selectedCountry, number: text });
        }}
      />

      {/* Modal for countries */}

      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView>
          <TextInput
            style={styles.searchInput}
            placeholder="Search country..."
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
          />
          <View style={styles.divider} />
          <FlatList
            data={filteredCountries}
            keyExtractor={item => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.countryItem}
                onPress={() => handleSelectCountry(item)}
              >
                <Text style={styles.countryName}>{item.country}</Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#DBD9D9',
  },
  countryBox: {
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 10,
  },
  countryText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  inputError: {
    borderBottomColor: 'red'
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    fontWeight: 500,
    fontSize: 13,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  countryName: {
    fontSize: 16,
    color: '#000',
  },
  countryCode: {
    fontSize: 16,
    color: '#555',
  },
  closeButton: {
    backgroundColor: 'black',
    padding: 15,
    alignItems: 'center',
  },
  searchInput: {
    borderWidth: 0,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: '#000',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
  },
});

export default CountyModel;
