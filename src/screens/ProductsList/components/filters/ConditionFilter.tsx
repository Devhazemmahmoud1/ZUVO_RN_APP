import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { getCairoFont } from '../../../../ultis/getFont';
import RadioRow from './RadioRow';

type PricesFilterProps = {
  visible: boolean;
  setVisible: (v: boolean) => void;
  handleSelectValue: (key: string, value: any) => void;
};

const ConditionFilter = ({ visible, setVisible, handleSelectValue }: PricesFilterProps) => {
  const [condition, setCondition] = useState<any>('any');

  const resetSelection = () => {
    setCondition('any');
  };

  const applyFilter = () => {
    handleSelectValue('item_condition', [condition]);
    setVisible(false);
  };


  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.nestedContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, getCairoFont('800')]}>Zuvo</Text>
            <TouchableOpacity
              onPress={() => {
                setVisible(false);
                resetSelection();
              }}
            >
              <Text style={[styles.cancel, getCairoFont('500')]}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* ===== Content: title + radio group ===== */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, getCairoFont('700')]}>Condition</Text>

            <View style={styles.radioGroup}>
              <RadioRow label="Any" value="any" condition={condition} setCondition={setCondition} />
              <RadioRow label="Brand New" value="new" condition={condition} setCondition={setCondition} />
              <RadioRow label="Used" value="used" condition={condition} setCondition={setCondition} />
            </View>
          </View>

          {/* ===== Footer: single full-width Apply button ===== */}
          <SafeAreaView style={styles.footerSafeArea}>
            <View style={styles.footer}>
              <TouchableOpacity style={styles.applyBtnFull} onPress={applyFilter}>
                <Text style={[styles.applyText, getCairoFont('800')]}>Apply Filter</Text>
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

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: { fontSize: 18, fontWeight: '600' },
  cancel: { marginTop: 3, fontSize: 15, color: 'tomato', lineHeight: 20 },

  /* Section */
  section: {
    paddingTop: 14,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#152032',
    marginBottom: 10,
  },

  /* Radio group */
  radioGroup: {
    gap: 8, // if your RN version doesn't support gap, remove and add marginBottom to rows
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1', // slate-300
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
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
  radioLabel: {
    fontSize: 15,
    color: '#152032',
  },

  /* Footer */
  footerSafeArea: {
    position: 'absolute',
    bottom: -30,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
  footer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  applyBtnFull: {
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 6,
  },
  applyText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ConditionFilter;
