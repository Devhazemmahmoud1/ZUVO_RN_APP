import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { getCairoFont } from '../../../../ultis/getFont';

type PricesFilterProps = {
  visible: boolean;
  setVisible: (v: boolean) => void;
  handleSelectValue: (key: string, value: any) => void;
};

const RatingFilter = ({ visible, setVisible, handleSelectValue }: PricesFilterProps) => {
  // Rating range (min..max), step = 0.1
  const [ratingRange, setRatingRange] = useState<[number, number]>([1.3, 5.0]);

  const resetSelection = () => {
    setRatingRange([1.3, 5.0]);
  };

  const applyFilter = () => {
    handleSelectValue('rating', {
      min: ratingRange[0],
      max: ratingRange[1],
    });
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

          {/* ===== Content: Title + Rating Range ===== */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, getCairoFont('700')]}>Rating</Text>

            {/* Current values */}
            <View style={styles.valuesRow}>
              <Text style={[styles.valueText, getCairoFont('600')]}>
                {ratingRange[0].toFixed(1)}★
              </Text>
              <Text style={[styles.toText, getCairoFont('600')]}>to</Text>
              <Text style={[styles.valueText, getCairoFont('600')]}>
                {ratingRange[1].toFixed(1)}★
              </Text>
            </View>

            {/* Range slider */}
            <View style={styles.sliderWrap}>
              <MultiSlider
                values={[ratingRange[0], ratingRange[1]]}
                onValuesChange={vals => {
                  // enforce step of 0.1
                  const [min, max] = vals as [number, number];
                  const round = (n: number) => Math.max(1.3, Math.min(5.0, Math.round(n * 10) / 10));
                  setRatingRange([round(min), round(max)]);
                }}
                onValuesChangeFinish={vals => {
                  const [min, max] = vals as [number, number];
                  const round = (n: number) => Math.max(1.3, Math.min(5.0, Math.round(n * 10) / 10));
                  setRatingRange([round(min), round(max)]);
                }}
                min={1.3}
                max={5.0}
                step={0.1}
                allowOverlap={false}
                snapped
                containerStyle={{}}
                trackStyle={styles.track}
                selectedStyle={styles.trackSelected}
                unselectedStyle={styles.trackUnselected}
                markerStyle={styles.marker}
                pressedMarkerStyle={styles.markerPressed}
              />
              <View style={styles.scaleRow}>
                <Text style={styles.scaleText}>1.3</Text>
                <Text style={styles.scaleText}>5.0</Text>
              </View>
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

  valuesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  valueText: {
    fontSize: 15,
    color: '#152032',
  },
  toText: {
    fontSize: 14,
    color: '#667085',
  },

  sliderWrap: {
    paddingTop: 8,
    paddingBottom: 2,
  },
  track: {
    height: 6,
    borderRadius: 6,
  },
  trackSelected: {
    backgroundColor: '#007bff',
  },
  trackUnselected: {
    backgroundColor: '#E5E7EB',
  },
  marker: {
    height: 22,
    width: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007bff',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  markerPressed: {
    borderColor: 'tomato',
  },
  scaleRow: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleText: {
    fontSize: 12,
    color: '#667085',
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

export default RatingFilter;
