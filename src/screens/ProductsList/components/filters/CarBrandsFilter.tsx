import React, { useState, useMemo } from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';

const carBrandsUAE = [
  'Toyota',
  'Nissan',
  'Mitsubishi',
  'Honda',
  'Hyundai',
  'Kia',
  'Mazda',
  'Chevrolet',
  'Ford',
  'GMC',
  'Jeep',
  'Dodge',
  'Chrysler',
  'Ram',
  'Suzuki',
  'Subaru',
  'Peugeot',
  'Renault',
  'Opel',
  'Skoda',
  'Seat',
  'Citroën',
  'Fiat',
  'MG',
  'Lexus',
  'Infiniti',
  'Acura',
  'Genesis',
  'Cadillac',
  'Lincoln',
  'Buick',
  'Volvo',
  'Jaguar',
  'Land Rover',
  'Range Rover',
  'Mini',
  'Chery',
  'Geely',
  'BYD',
  'Haval',
  'Great Wall',
  'Proton',
  'Mercedes-Benz',
  'BMW',
  'Audi',
  'Volkswagen',
  'Porsche',
  'Alfa Romeo',
  'Maserati',
  'DS Automobiles',
  'Ferrari',
  'Lamborghini',
  'McLaren',
  'Aston Martin',
  'Bentley',
  'Rolls-Royce',
  'Bugatti',
  'Pagani',
  'Koenigsegg',
  'Lotus',
  'Tesla',
  'Lucid',
  'Rivian',
  'Nio',
  'XPeng',
  'Polestar',
  'Isuzu',
  'Hino',
  'Foton',
  'Ashok Leyland',
  'MAN',
  'Scania',
  'Iveco',
  'DAF',
];

const CarBrandsFilter = ({ visible, setVisible, handleSelectValue }) => {
  const [search, setSearch] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // filter list
  const filteredBrands = useMemo(() => {
    if (!search) return carBrandsUAE;
    return carBrandsUAE.filter(brand =>
      brand.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand],
    );
  };

  const resetSelection = () => {
    setSelectedBrands([]);
  };

  const applyFilter = () => {
    handleSelectValue('car_brand', selectedBrands);
    setVisible(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.nestedContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Select Car Brands</Text>
            <TouchableOpacity onPress={() => {
                setVisible(false)
                setSelectedBrands([])
            }}>
              <Text style={styles.cancel}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* Search bar */}
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search brands..."
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
          </View>

          {/* List takes all remaining space */}
          <FlatList
            data={filteredBrands}
            keyExtractor={item => item}
            renderItem={({ item }) => {
              const isSelected = selectedBrands.includes(item);
              return (
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => toggleBrand(item)}
                >
                  <Text style={styles.rowTitle}>{item}</Text>
                  <View
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.checkboxInner} />}
                  </View>
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={{ paddingBottom: 100 }} // keep space for footer
          />

          {/* Footer fixed at bottom */}
          <SafeAreaView style={styles.footerSafeArea}>
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={resetSelection}
              >
                <Text style={styles.footerTextReset}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={applyFilter}>
                <Text style={styles.footerText}>Apply Filter</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  nestedContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: { fontSize: 18, fontWeight: '600' },
  cancel: { marginTop: 3, fontSize: 15, color: 'tomato' },
  searchContainer: { marginVertical: 10 },
  searchInput: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rowTitle: { fontSize: 15, fontWeight: '500', color: '#152032' },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#007bff',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderColor: '#007bff',
    backgroundColor: '#007bff',
  },
  checkboxInner: { width: 10, height: 10, backgroundColor: '#fff' },
  footerSafeArea: {
    position: 'absolute',
    bottom: -30,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  resetBtn: {
    flex: 1,
    padding: 14,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007bff',
    borderRadius: 6,
    marginRight: 8,
  },
  applyBtn: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 6,
    marginLeft: 8,
  },
  footerText: { color: '#fff', fontWeight: '600' },
  footerTextReset: { color: '#007bff', fontWeight: '600', fontSize: 15 },
});

export default CarBrandsFilter;
