import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';
import { getCairoFont } from '../../../../ultis/getFont';
import DirhamLogo from '../../../../icons/Dirham';

type PricesFilterProps = {
  visible: boolean;
  setVisible: (v: boolean) => void;
  handleSelectValue: (key: string, value: any) => void;
};

const PricesFilter = ({ visible, setVisible, handleSelectValue }: PricesFilterProps) => {
  const [selectedPrices, setSelectedPrices] = useState<string[]>(['', '']); // keep if used elsewhere

  const resetSelection = () => {
    setSelectedPrices([]);
  };

  const applyFilter = () => {
    // send min/max along with your existing key
    handleSelectValue('price', {
      min: selectedPrices ? Number(selectedPrices[0]) : null,
      max: selectedPrices ? Number(selectedPrices[1]) : null,
    });
    setVisible(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.nestedContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Zuvo</Text>
            <TouchableOpacity
              onPress={() => {
                setVisible(false);
                setSelectedPrices([]);
              }}
            >
              <Text style={[styles.cancel, getCairoFont('500')]}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* === Price range (two inline sections) === */}
          <View style={styles.rangeRow}>
            {/* Min */}
            <View style={styles.rangeCol}>
              <Text style={[styles.rangeLabel, getCairoFont('400')]}>Min</Text>
              <View style={styles.inputUnderlineRow}>
                <TextInput
                  value={selectedPrices[0]}
                  onChangeText={(e) => {
                    setSelectedPrices(prev => {
                      const newPrices = [...prev];
                      newPrices[0] = e; // replace with your value
                      return newPrices;
                    });
                  }}
                  placeholder="0"
                  keyboardType="numeric"
                  inputMode="numeric"
                  style={styles.inputUnderline}
                />
                <Text style={styles.currency}><DirhamLogo size={15} /></Text>
              </View>
            </View>

            {/* Max */}
            <View style={styles.rangeCol}>
              <Text style={[styles.rangeLabel,  getCairoFont('400')]}>Max</Text>
              <View style={styles.inputUnderlineRow}>
                <TextInput
                  value={selectedPrices[1]}
                  onChangeText={(e) => {
                    setSelectedPrices(prev => {
                      const newPrices = [...prev];
                      newPrices[1] = e; // replace with your value
                      return newPrices;
                    });
                  }}
                  placeholder="0"
                  keyboardType="numeric"
                  inputMode="numeric"
                  style={styles.inputUnderline}
                />
                <Text style={styles.currency}><DirhamLogo size={15} /></Text>
              </View>
            </View>
          </View>

          {/* Footer fixed at bottom */}
          <SafeAreaView style={styles.footerSafeArea}>
            <View style={styles.footer}>
              <TouchableOpacity style={styles.resetBtn} onPress={resetSelection}>
                <Text style={[styles.footerTextReset , getCairoFont('600')]}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={applyFilter}>
                <Text style={[styles.footerText, getCairoFont('600')]}>Apply Filter</Text>
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
  cancel: { marginTop: 3, fontSize: 15, color: 'tomato', lineHeight: 20 },

  // ---- Range block
  rangeRow: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12, // if your RN version doesn't support gap, remove this and add marginRight to the first column
  },
  rangeCol: {
    flex: 1,
  },
  rangeLabel: {
    fontSize: 12,
    color: '#152032',
    marginBottom: 6,
  },
  inputUnderlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#ddd',
    paddingBottom: 6
  },
  inputUnderline: {
    flex: 1,
    paddingVertical: 4,
    paddingRight: 8,
    fontSize: 16,
    color: '#152032',
  },
  currency: {
    fontSize: 14,
    color: '#667085',
    marginBottom: 1,
  },

  // ---- (your existing styles)
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
  footerText: { color: '#fff' },
  footerTextReset: { color: '#007bff', fontSize: 15 },
});

export default PricesFilter;
