import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  FlatList,
} from 'react-native';
import CarBrandsFilter from './filters/CarBrandsFilter';
import ProductBrandsFilter from './filters/ProductsBrand';
import CategoriesFilter from './filters/CategoriesModel';
import PricesFilter from './filters/PriceFilterModel';
import { getCairoFont } from '../../../ultis/getFont';
import RatingFilter from './filters/RatingFilter';
import ConditionFilter from './filters/ConditionFilter';

const { height } = Dimensions.get('window');

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedValues: any;
  setSelectedValues: any
}

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, selectedValues, setSelectedValues }) => {
  const [slideAnim] = useState(new Animated.Value(height));
  const [carBrandsFilter, setCarBrandsFilter] = useState(false);
  const [productBrandsFilter, setProductBrandsFilter] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  const [openPrices, setOpenPrices] = useState(false);
  const [openRate, setOpenRate] = useState(false)
  const [openItemCondition, setOpenItemCondition] = useState(false)


  const openAnim = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeAnim = (cb?: () => void) => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      cb?.();
      onClose();
    });
  };

  const filters: any = [
    { id: '1', title: 'Car Brand', value: 'car_brand' },
    {
      id: '2',
      title: 'Product Brand',
      value: 'product_brand',
    },
    { id: '3', title: 'Category', value: 'category' },
    { id: '4', title: 'Price', value: 'price' },
    // {
    //   id: '7',
    //   title: 'Product Rating',
    //   value: 'product_rating',
    // },
    {
      id: '9',
      title: 'Item Condition',
      value: 'item_condition',
    },
  ];

  const handleResetValues = () => {
    setSelectedValues([
      {
        car_brand: [],
        product_brand: [],
        category: [],
        price: [],
        product_rating: [],
        item_condition: [],
      },
    ]);
  };

  const handleSelectValue = (key: any, value: any) => {
    console.log(key, value);
    setSelectedValues(oldValues => {
      const updated = [...oldValues]; // clone array
      updated[0] = {
        ...updated[0], // keep existing keys
        [key]: value, // update only the one you want
      };
      return updated;
    });
  };

  const handleOpenModel = value => {
    switch (value) {
      case 'car_brand':
        setCarBrandsFilter(true);
        break;
      case 'product_brand':
        setProductBrandsFilter(true);
        break;
      case 'category':
        setOpenCategories(true);
        break;
      case 'price':
        setOpenPrices(true);
        break;
      case 'product_rating':
        setOpenRate(true)
        break;
      case 'item_condition':
        setOpenItemCondition(true)
        break;
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none" onShow={openAnim}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity style={styles.overlay} onPress={() => closeAnim()} />
        <Animated.View
          style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Zuvo</Text>
            <TouchableOpacity onPress={() => closeAnim()}>
              <Text style={[styles.cancel, getCairoFont('600')]}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Body */}
          <FlatList
            data={filters}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.row}
                onPress={() => handleOpenModel(item.value)}
              >
                <View style={styles.rowText}>
                  <Text style={[styles.rowTitle, getCairoFont('600')]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.rowSubtitle, getCairoFont('400')]}>
                    {item.value === 'category'
                      ? selectedValues[0].category
                          .map(res => res.name)
                          .join(', ')
                      : item.value === 'price'
                      ? `${
                          typeof selectedValues[0].price.min !== 'undefined'
                            ? selectedValues[0].price.min
                            : '~'
                        } - ${
                          typeof selectedValues[0].price.max !== 'undefined'
                            ? selectedValues[0].price.max
                            : '~'
                        }`
                      : selectedValues[0][item.value].join(', ')}
                  </Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            )}
          />

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.reset]}
              onPress={() => handleResetValues()}
            >
              <Text style={[styles.footerTextReset, getCairoFont('800')]}>
                Reset
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.apply]}
              onPress={() => closeAnim()}
            >
              <Text style={[styles.buttonText, getCairoFont('800')]}>
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>

      {/* Filter Modal */}
      <CarBrandsFilter
        visible={carBrandsFilter}
        setVisible={setCarBrandsFilter}
        handleSelectValue={handleSelectValue}
      />

      <ProductBrandsFilter
        visible={productBrandsFilter}
        setVisible={setProductBrandsFilter}
        handleSelectValue={handleSelectValue}
      />

      <CategoriesFilter
        visible={openCategories}
        setVisible={setOpenCategories}
        handleSelectValue={handleSelectValue}
      />

      <PricesFilter
        visible={openPrices}
        setVisible={setOpenPrices}
        handleSelectValue={handleSelectValue}
      />

      <RatingFilter
        visible={openRate}
        setVisible={setOpenRate}
        handleSelectValue={handleSelectValue}
      />

      <ConditionFilter
        visible={openItemCondition}
        setVisible={setOpenItemCondition}
        handleSelectValue={handleSelectValue}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  cancel: {
    marginTop: 3,
    fontSize: 15,
    color: 'tomato',
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    marginTop: 5,
    fontSize: 15,
    color: '#152032',
    lineHeight: 20,
  },
  rowSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
    lineHeight: 15,
  },
  arrow: {
    fontSize: 20,
    color: '#999',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  reset: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007bff',
  },
  apply: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    letterSpacing: 1,
  },
  footerTextReset: { color: '#007bff', fontSize: 15, letterSpacing: 1 },
  nestedContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
  },
});

export default FilterModal;
