import React, { useEffect, useRef, useState, useCallback } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Animated, FlatList, Pressable, Dimensions } from 'react-native';
import { useAddressContext } from '../../../AddressProvider';
import { getCairoFont } from '../../../ultis/getFont';
import { useLanguage } from '../../../LanguageProvider';
import { t } from 'i18next';

const { height } = Dimensions.get('window');

// Control how tall the sheet is (e.g. 0.85 = 85% of screen)
const SHEET_RATIO = 0.75;
const SHEET_HEIGHT = Math.round(height * SHEET_RATIO);

const AddressSwitcher = ({ openAddressSwitcher, cancel }) => {

  // ✅ translateY anim (0 = fully open; SHEET_HEIGHT = fully hidden below screen)
  const {
    addresses,
    activeSelection,
    setActiveSelection,
    effectiveAddress
  } = useAddressContext();
  const [selectedId, setSelectedId] = useState<any | null>(effectiveAddress?.id);
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  const { isRTL } = useLanguage()

  // Open/close animation
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: openAddressSwitcher ? 0 : SHEET_HEIGHT,
      duration: 300,
      useNativeDriver: true, // ✅ smoother
    }).start();

  }, [openAddressSwitcher, translateY]);

  // Preselect currently active address (optional)
  useEffect(() => {
    if (activeSelection && 'id' in activeSelection && activeSelection.id !== 'current_location') {
      setSelectedId(activeSelection.id as any);
    } else {
      setSelectedId(null);
    }
  }, [activeSelection]);

  const close = useCallback(() => {
    Animated.timing(translateY, {
      toValue: SHEET_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => cancel());
  }, [translateY, cancel]);

  const handleSelect = (item: any) => {
    // console.log(item)
    setSelectedId(item.id ?? null);
    // ✅ update global active selection with the FULL object
    setActiveSelection(item);
    close();
  };

  const renderItem = ({ item }: { item: any }) => {
    const isSelected = selectedId === item.id;
    return (
      <>
        <TouchableOpacity style={styles.row} onPress={() => handleSelect(item)}>
          <Text style={styles.rowText}>{item.address ?? `${item.firstName ?? ''} ${item.lastName ?? ''}`}</Text>
          <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
            {isSelected && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
      </>
    );
  };

  if (!openAddressSwitcher) return null;

  return (
    <>
      {/* overlay behind the sheet */}
      <Pressable style={styles.overlay} onPress={close} />

      <Animated.View
        style={[
          styles.modal,
          {
            height: SHEET_HEIGHT,
            transform: [{ translateY }], // ✅ bottom slide
          },
        ]}
      >
        <Text style={[styles.modelHeader, isRTL ? { textAlign: 'left' } : undefined, getCairoFont('600')]}>{t('addresses')}</Text>
        <View style={styles.divider} />

        <FlatList
          data={addresses}
          renderItem={renderItem}
          keyExtractor={(item, index) => String(item.id ?? index)}
          ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 24 }}
        />

        {/* (Optional) Add a "Use Current Location" row */}
        {/* <TouchableOpacity style={styles.row} onPress={() => { setActiveSelection({ id: 'current_location' }); close(); }}>
          <Text style={styles.rowText}>Use Current Location</Text>
          {'id' in (activeSelection ?? {}) && activeSelection?.id === 'current_location' ? (
            <View style={[styles.radioOuter, styles.radioOuterSelected]}>
              <View style={styles.radioInner} />
            </View>
          ) : (
            <View style={styles.radioOuter} />
          )}
        </TouchableOpacity> */}
      </Animated.View>

      {/* If you want a floating close button, position it relative to bottom: 0 */}
      <Animated.View style={[styles.fabClose, { transform: [{ translateY: Animated.add(translateY, new Animated.Value(-25)) }] }]}>
        <TouchableOpacity onPress={close}><Text style={styles.closeText}>×</Text></TouchableOpacity>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    borderWidth: 0.5,
    marginTop: 5,
    borderColor: '#ccc',
  },
  modelHeader: {
    fontSize: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  modal: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,                // ✅ anchor to bottom
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 16,
    zIndex: 51,               // above overlay
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 5,
  },
  rowText: { fontSize: 12, maxWidth: '90%' },
  radioOuter: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#007bff',
    alignItems: 'center', justifyContent: 'center',
  },
  radioOuterSelected: { borderColor: '#007bff' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#007bff' },
  fabClose: {
    position: 'absolute',
    top: 140,
    right: 20,
    bottom: SHEET_HEIGHT + 10, // floats above opened sheet
    backgroundColor: '#fff',
    borderRadius: 25,
    width: 50, height: 50, justifyContent: 'center', alignItems: 'center',
    zIndex: 52,
  },
  closeText: { fontSize: 20, fontWeight: 'bold' },
});

export default AddressSwitcher;
