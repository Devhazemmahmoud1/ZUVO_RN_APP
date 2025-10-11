import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getCairoFont } from '../../ultis/getFont';
import { StackActions, useNavigation } from '@react-navigation/native';

type Props = {
  addressLabel?: string;
  address?: string;
  shipmentNumber?: number;
  isExpress?: boolean;
  estimatedLabel?: string;
  arrivingWhen?: string; // e.g. "Tomorrow"
  productImage?: string;
  qty?: number;
  onContinue?: () => void;
};


// {
//   addressLabel = 'Home',
//   address,
//   shipmentNumber = 1,
//   estimatedLabel = 'Estimated delivery',
//   arrivingWhen,
//   productImage,
//   qty = 1,
//   onContinue,
// }

const OrderPlacedScreen: React.FC<Props> = ({ route }: any) => {
  const navigation = useNavigation<any>();

  console.log(route.params)

  const handleContinue = () => {
    // if (onContinue) return onContinue();
    // Default: jump to Home tab (parent is the bottom tabs navigator)
    try {
      navigation.dispatch(StackActions.popToTop());
      const parent = (navigation as any)?.getParent?.() || navigation;
      parent?.navigate?.('Home');
    } catch {}
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header: success icon + title + subtext */}
        <View style={styles.headerWrap}>
          <Ionicons name="checkmark-circle" size={44} color="#16A34A" />
          <Text style={[styles.headerTitle, getCairoFont('800')]}>Order placed</Text>
          <Text style={[styles.headerSub, getCairoFont('600')]}>Thanks! Your order is confirmed.</Text>
        </View>

        {/* Delivery address card */}
        <View style={styles.card}>
          <View style={styles.rowCenter}>
            <Ionicons name="location-sharp" size={18} color="#EF4444" />
            <Text style={[styles.cardTitle, getCairoFont('700')]}>Delivery address <Text style={styles.muted}>({route.params.addressLabel})</Text></Text>
          </View>
          <Text style={[styles.cardBodyText, getCairoFont('600')]}>{route.params.address}</Text>
        </View>

        {/* Shipment card */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={[styles.sectionLabel, getCairoFont('700')]}>Shipment {route.params.shipmentNumber}</Text>
            {/* {isExpress && (
              <View style={styles.expressBadge}>
                <Text style={[styles.expressText, getCairoFont('800')]}>express</Text>
              </View>
            )} */}
          </View>

          <View style={[styles.rowBetween, { marginTop: 8 }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.estimateLabel, getCairoFont('700')]}>{route.params.estimatedLabel}</Text>
              <Text style={[styles.arrivingText, getCairoFont('800')]}>Arriving <Text style={styles.arrivingWhen}>{route.params.arrivingWhen}</Text></Text>
            </View>

            {/* Product thumbnail with qty badge */}
            <View style={styles.thumbWrap}>
              <Image source={{ uri: route.params.productImage }} style={styles.thumb} resizeMode="cover" />
              <View style={styles.qtyBadge}>
                <Text style={styles.qtyText}>x {route.params.qty}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Spacer */}
        <View style={{ height: 16 }} />

        {/* Continue link */}
        <TouchableOpacity onPress={handleContinue} activeOpacity={0.9} style={styles.ctaBtn}>
          <Text style={[styles.ctaTxt, getCairoFont('800')]}>Continue shopping</Text>
        </TouchableOpacity>

        {/* Bottom spacer to avoid home indicator overlap */}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderPlacedScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  // Header
  headerWrap: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 12,
    gap: 6,
  },
  headerTitle: {
    fontSize: 20,
    color: '#111827',
  },
  headerSub: {
    fontSize: 12,
    color: '#6B7280',
  },

  // Cards
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E6E6E6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Address
  cardTitle: {
    fontSize: 14,
    color: '#333',
    },
  muted: {
    color: '#6B7280',
    fontWeight: '600',
  },
  cardBodyText: {
    marginTop: 8,
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
  },

  // Shipment
  sectionLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '700',
  },
  estimateLabel: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '700',
    marginBottom: 2,
  },
  arrivingText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '700',
  },
  arrivingWhen: {
    color: '#1DBA63', // green word "Tomorrow"
    fontWeight: '800',
  },
  expressBadge: {
    backgroundColor: '#FFD400',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  expressText: {
    fontSize: 12,
    color: '#1F2937',
    textTransform: 'lowercase',
  },

  // Thumbnail + qty
  thumbWrap: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F3F4F6',
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  qtyBadge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: '#6B7280',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  qtyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },

  // Continue link
  ctaBtn: {
    marginTop: 4,
    alignSelf: 'center',
    backgroundColor: 'tomato',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },
  ctaTxt: {
    color: '#fff',
    fontSize: 13,
  },
});
