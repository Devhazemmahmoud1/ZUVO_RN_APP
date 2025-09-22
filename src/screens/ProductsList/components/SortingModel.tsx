import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Pressable,
} from 'react-native';
import { useSorting } from '../../../SortingContext';

const { height } = Dimensions.get('window');

interface Option {
  id: string;
  label: string;
  value: any;
}

const options: Option[] = [
  { id: '1', label: 'Price: High to Low', value: 'price_to_low' },
  { id: '2', label: 'Price: Low to High', value: 'price_to_high' },
  { id: '3', label: 'New Arrivals', value: 'newest' },
  { id: '4', label: 'Best Rated', value: 'popular' },
];

interface SortingModelProps {
  visible: boolean;
  onClose: () => void;
  selectedValues: any
  setSelectedValues: any
}

const SortingModel = ({ visible, onClose, selectedValues, setSelectedValues }: SortingModelProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const animation = useRef(new Animated.Value(height)).current;
  const { sorting, setSorting } = useSorting();

  // Animate modal when `visible` changes
  useEffect(() => {
    Animated.timing(animation, {
      toValue: visible ? height * 0.6 : height,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [visible, animation]);

  useEffect(() => {
    // find which option matches current global sorting
    const found = options.find(opt => opt.value === sorting);
    if (found) {
      setSelectedId(found.id);
    }
  }, [sorting]);

  const handleSelect = (id: string) => {
    setSelectedId(id);

    const selectedOption = options.find(opt => opt.id === id);
    if (selectedOption) {
      setSorting(selectedOption.value); // update global state
    }

    // Close modal after selection
    Animated.timing(animation, {
      toValue: height,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      onClose();
    });
  };

  const renderItem = ({ item }: { item: Option }) => {
    const isSelected = selectedId === item.id;
    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => handleSelect(item.id)}
      >
        <Text style={styles.rowText}>{item.label}</Text>
        <View
          style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}
        >
        
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </TouchableOpacity>
    );
  };

  if (!visible) return null;

  return (
    <>
      <Pressable
        style={styles.overlay}
        onPress={() => {
          Animated.timing(animation, {
            toValue: height,
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            onClose();
          });
        }}
      />
      <Animated.View style={[styles.modal, { top: animation }]}>
        <FlatList
          data={options}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={{ height: 2 }} />} // smaller vertical gap
          contentContainerStyle={{ paddingTop: 10 }}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.closeButton,
          { top: Animated.add(animation, new Animated.Value(-25)) },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            Animated.timing(animation, {
              toValue: height,
              duration: 200,
              useNativeDriver: false,
            }).start(() => {
              onClose();
            });
          }}
        >
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: height * 0.4,
    backgroundColor: '#fff',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 5,
  },
  rowText: { fontSize: 14 },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#007bff',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007bff',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: { fontSize: 20, fontWeight: 'bold' },
});

export default SortingModel;
