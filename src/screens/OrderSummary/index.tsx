// OrderSummaryScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCairoFont } from '../../ultis/getFont';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

type ShipmentItem = {
  id: string | number;
  brand: string;
  title: string;
  thumb: string;
  deliveredAt: string; // e.g. "Thursday, 16th Nov, 02:39 PM"
  status: 'Completed' | 'Shipped' | 'Processing';
};

type Props = {
  onBack?: () => void;
  onInvoices?: () => void;
  onViewRefund?: () => void;
  onHelp?: () => void;
  onViewMoreItem?: (id: ShipmentItem['id']) => void;
  order?: {
    code: string; // e.g. NAEFB0054305886
    placedOn: string; // formatted date-time
    itemsValue: string; // "349.20"
    fees: string; // "FREE"
    total: string; // "349.20"
    paymentBadge?: string; // "tabby"
    paymentText: string; // "Paid by tabby"
    addressLabel: string; // "Home"
    customerName: string;
    addressLines: string[];
    phone: string;
    phoneVerified?: boolean;
    getItTomorrowNote?: string;
    shipments: ShipmentItem[];
  };
};


export default function OrderSummaryScreen({
  onBack,
  onInvoices,
  onViewRefund,
  onHelp,
  onViewMoreItem,
}: Props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

    const SAMPLE: Props['order'] = {
  code: 'NAEFB0054305886',
  placedOn: 'Nov 14, 2023, 08:40 PM',
  itemsValue: '349.20',
  fees: 'FREE',
  total: '349.20',
  paymentBadge: 'tabby',
  paymentText: 'Paid by tabby',
  addressLabel: 'Home',
  customerName: 'Hazem Saleh',
  addressLines: [
    'sadaf 4 building , 25th floor, apartment number 2504,',
    'Dubai, United Arab Emirates',
  ],
  phone: '+971-52-1653509',
  phoneVerified: true,
  getItTomorrowNote:
    'Select this option to receive all your eligible express items by tomorrow.',
  shipments: [
    {
      id: '1',
      brand: 'Ugreen',
      title: '2Pack iPhone 16 15 Plus Screen Protector 6.7 I…',
      thumb:
        'https://images.unsplash.com/photo-1585386959984-a41552231656?w=200&h=200&fit=crop',
      deliveredAt: 'Thursday, 16th Nov, 02:39 PM',
      status: 'Completed',
    },
    {
      id: '2',
      brand: 'Ugreen',
      title: 'iPhone 15 Magsafe Case Clear 【N52 Str…',
      thumb:
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop',
      deliveredAt: 'Thursday, 16th Nov, 02:39 PM',
      status: 'Completed',
    },
    {
      id: '3',
      brand: 'Nobel',
      title: 'Digital Air Fryer With 6.5 L Basket And Cap…',
      thumb:
        'https://images.unsplash.com/photo-1542834369-f10ebf06d3cb?w=200&h=200&fit=crop',
      deliveredAt: 'Thursday, 16th Nov, 02:39 PM',
      status: 'Completed',
    },
  ],
};


  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} hitSlop={HITSLOP}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, getCairoFont('800')]}>Order summary</Text>
          <View style={{ width: 28 }} />
        </View>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <SkeletonPlaceholder borderRadius={12}>
            {/* Order ID + placed on */}
            <SkeletonPlaceholder.Item marginBottom={14}>
              <SkeletonPlaceholder.Item width={200} height={20} />
              <SkeletonPlaceholder.Item width={140} height={14} marginTop={10} />
            </SkeletonPlaceholder.Item>

            {/* Invoices row */}
            <SkeletonPlaceholder.Item height={54} borderRadius={10} />

            {/* Order details block */}
            <SkeletonPlaceholder.Item marginTop={16}>
              <SkeletonPlaceholder.Item width={140} height={18} />
              <SkeletonPlaceholder.Item marginTop={12}>
                <SkeletonPlaceholder.Item width={'60%'} height={14} />
                <SkeletonPlaceholder.Item width={'30%'} height={14} marginTop={10} alignSelf="flex-end" />
              </SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item marginTop={12}>
                <SkeletonPlaceholder.Item width={'40%'} height={14} />
                <SkeletonPlaceholder.Item width={70} height={14} marginTop={10} alignSelf="flex-end" />
              </SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item marginTop={12}>
                <SkeletonPlaceholder.Item width={'50%'} height={16} />
                <SkeletonPlaceholder.Item width={90} height={16} marginTop={10} alignSelf="flex-end" />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>

            {/* Payment details block */}
            <SkeletonPlaceholder.Item marginTop={18}>
              <SkeletonPlaceholder.Item width={160} height={18} />
              <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginTop={12}>
                <SkeletonPlaceholder.Item width={60} height={22} borderRadius={6} />
                <SkeletonPlaceholder.Item width={'50%'} height={14} marginLeft={10} />
                <SkeletonPlaceholder.Item width={70} height={16} marginLeft={'auto'} />
              </SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item width={160} height={40} borderRadius={10} marginTop={12} />
            </SkeletonPlaceholder.Item>

            {/* Address block */}
            <SkeletonPlaceholder.Item marginTop={18}>
              <SkeletonPlaceholder.Item width={160} height={18} />
              <SkeletonPlaceholder.Item width={120} height={16} marginTop={10} />
              <SkeletonPlaceholder.Item width={'90%'} height={14} marginTop={8} />
              <SkeletonPlaceholder.Item width={'70%'} height={14} marginTop={6} />
              <SkeletonPlaceholder.Item width={140} height={14} marginTop={10} />
            </SkeletonPlaceholder.Item>

            {/* Shipments list (3 items) */}
            <SkeletonPlaceholder.Item marginTop={18}>
              <SkeletonPlaceholder.Item width={180} height={18} />
              {[1,2,3].map((_,i) => (
                <SkeletonPlaceholder.Item key={i} marginTop={14}>
                  <SkeletonPlaceholder.Item width={'50%'} height={12} />
                  <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginTop={10}>
                    <SkeletonPlaceholder.Item width={68} height={68} borderRadius={8} />
                    <SkeletonPlaceholder.Item marginLeft={12}>
                      <SkeletonPlaceholder.Item width={120} height={12} />
                      <SkeletonPlaceholder.Item width={200} height={12} marginTop={8} />
                    </SkeletonPlaceholder.Item>
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
              ))}
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={HITSLOP}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, getCairoFont('800')]}>Order summary</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Order ID */}
        <View style={styles.block}>
          <Text style={[styles.orderId, getCairoFont('900')] }>
            Order ID - <Text style={styles.orderCode}>{SAMPLE.code}</Text>
          </Text>
          <Text style={[styles.placedOn, getCairoFont('600')]}>Placed On {SAMPLE.placedOn}</Text>
        </View>

        {/* View invoices row */}
        <TouchableOpacity style={styles.row} onPress={onInvoices} activeOpacity={0.7}>
          <View>
            <Text style={[styles.rowTitle, getCairoFont('800')]}>View order invoices</Text>
            <Text style={[styles.rowSubtitle, getCairoFont('600')] }>
              Invoices are available once items are packed
            </Text>
          </View>
          <Text style={styles.chev}>›</Text>
        </TouchableOpacity>

        {/* Order details */}
        <View style={styles.block}>
          <Text style={[styles.sectionTitle, getCairoFont('800')]}>Order details</Text>

          <View style={styles.line}>
            <Text style={[styles.lineLabel, getCairoFont('700')] }>
              Items value <Text style={styles.muted}>(3 items)</Text>
            </Text>
            <Text style={[styles.money, getCairoFont('800')]}>؋ {SAMPLE.itemsValue}</Text>
          </View>

          <View style={styles.line}>
            <Text style={[styles.lineLabel, getCairoFont('700')]}>Fees</Text>
            <Text style={[styles.feeFree, getCairoFont('800')]}>{SAMPLE.fees}</Text>
          </View>

          <View style={styles.totalLine}>
            <Text style={[styles.totalLabel, getCairoFont('800')]}>
              Order total <Text style={styles.muted}>inc. VAT</Text>
            </Text>
            <Text style={[styles.totalMoney, getCairoFont('900')]}>؋ {SAMPLE.total}</Text>
        </View>
        </View>

        {/* Payment details */}
        <View style={styles.block}>
          <Text style={[styles.sectionTitle, getCairoFont('800')]}>Payment details</Text>
          <View style={styles.payRow}>
            {!!SAMPLE.paymentBadge && (
              <View style={styles.pill}>
                <Text style={[styles.pillText, getCairoFont('900')]}>{SAMPLE.paymentBadge}</Text>
              </View>
            )}
            <Text style={[styles.payText, getCairoFont('700')]}>{SAMPLE.paymentText}</Text>
            <View style={{ flex: 1 }} />
            <Text style={[styles.money, getCairoFont('800')]}>؋ {SAMPLE.total}</Text>
          </View>

          <TouchableOpacity
            style={styles.refundBtn}
            activeOpacity={0.8}
            onPress={onViewRefund}
          >
            <Text style={[styles.refundText, getCairoFont('800')]}>View refund details</Text>
          </TouchableOpacity>
        </View>

        {/* Delivery address */}
        <View style={styles.block}>
          <Text style={[styles.sectionTitle, getCairoFont('800')] }>
            Delivery address <Text style={styles.muted}>({SAMPLE.addressLabel})</Text>
          </Text>

          <Text style={[styles.name, getCairoFont('800')]}>{SAMPLE.customerName}</Text>
          {SAMPLE.addressLines.map((line, idx) => (
            <Text key={idx} style={[styles.addrLine, getCairoFont('600')] }>
              {line}
            </Text>
          ))}

          <View style={styles.phoneRow}>
            <Text style={[styles.addrLine, getCairoFont('600')]}>{SAMPLE.phone}</Text>
            {SAMPLE.phoneVerified && (
              <Text style={[styles.verified, getCairoFont('800')]}>Verified</Text>
            )}
          </View>
        </View>

        {/* Get it Tomorrow */}
        <View style={styles.getItCard}>
          <View style={styles.getItTop}>
            <View style={styles.getItIcon}>
              <Text style={styles.getItIconText}>◷</Text>
            </View>
            <Text style={[styles.getItTitle, getCairoFont('800')]}>Get It Tomorrow</Text>
          </View>
          <Text style={[styles.getItNote, getCairoFont('600')]}>{SAMPLE.getItTomorrowNote}</Text>
        </View>

        {/* Delivery instructions (collapsed appearance) */}
        <TouchableOpacity style={styles.row}>
          <View style={styles.checkbox} />
          <Text style={styles.rowTitle}>Get items together</Text>
          <View style={{ flex: 1 }} />
          <Text style={styles.chev}>›</Text>
        </TouchableOpacity>

        {/* Delivery details list */}
        <View style={styles.block}>
          <Text style={[styles.sectionTitle, getCairoFont('800')]}>Delivery details</Text>
        </View>

        <FlatList
          data={SAMPLE.shipments}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item, index }) => (
            <View style={[styles.shipmentBlock, index > 0 && { marginTop: 18 }]}>
              <Text style={[styles.shipDate, getCairoFont('800')] }>
                Delivered on {item.deliveredAt}
              </Text>
              <Text style={[styles.shipStatus, getCairoFont('700')]}>{item.status}</Text>

              <View style={styles.itemRow}>
                <Image source={{ uri: item.thumb }} style={styles.itemThumb} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.itemBrand, getCairoFont('800')]}>{item.brand}</Text>
                  <Text style={[styles.itemTitle, getCairoFont('700')]} numberOfLines={2}>
                    {item.title}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => onViewMoreItem?.(item.id)}
                  hitSlop={HITSLOP}
                >
                  <Text style={[styles.viewMore, getCairoFont('800')]}>View More</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          scrollEnabled={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Floating Help bubble */}
      <TouchableOpacity
        style={styles.helpBubble}
        activeOpacity={0.9}
        onPress={onHelp}
      >
        <Text style={styles.helpIcon}>i</Text>
        <Text style={styles.helpText}>Need Help?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const HITSLOP = { top: 8, bottom: 8, left: 8, right: 8 };

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'android' ? 8 : 0,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8ECEF',
  },
  backArrow: { fontSize: 28, color: '#1e2432', width: 28, textAlign: 'left' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    color: '#2B3148',
  },
  container: { paddingBottom: 24 },
  block: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8ECEF',
  },
  orderId: { fontSize: 20, color: '#2B3148', letterSpacing: 0.2 },
  orderCode: { color: '#2B3148' },
  placedOn: { marginTop: 8, color: '#7C8795', fontSize: 13 },

  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#E8ECEF',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowTitle: { fontSize: 15, color: '#2B3148' },
  rowSubtitle: { marginTop: 4, fontSize: 13, color: '#6F7F8E' },
  chev: { fontSize: 26, color: '#9AA6B2', marginLeft: 10 },

  sectionTitle: { fontSize: 18, color: '#2B3148', marginBottom: 14 },

  line: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  lineLabel: { fontSize: 15, color: '#2B3148' },
  money: { fontSize: 15, color: '#2B3148', marginLeft: 'auto' },
  feeFree: { fontSize: 15, color: '#21A179', marginLeft: 'auto' },
  muted: { color: '#8A95A2', fontWeight: '700' },

  totalLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ECEFF3',
  },
  totalLabel: { fontSize: 17, color: '#2B3148' },
  totalMoney: { marginLeft: 'auto', fontSize: 17, color: '#2B3148' },

  payRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  pill: {
    backgroundColor: '#D7F1E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  pillText: { color: '#1E9D78', fontSize: 12 },
  payText: { fontSize: 15, color: '#2B3148' },

  refundBtn: {
    backgroundColor: '#EEF4FF',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  refundText: { color: '#4976F5', fontSize: 15 },

  name: { fontSize: 16, color: '#2B3148', marginBottom: 6 },
  addrLine: { fontSize: 14, color: '#414D5B', marginBottom: 2, lineHeight: 20 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  verified: {
    marginLeft: 10,
    color: '#1E9D78',
    fontWeight: '800',
    backgroundColor: '#E6F8F1',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 13,
  },

  getItCard: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8ECEF',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  getItTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  getItIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF6E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  getItIconText: { color: '#F4A500', fontWeight: '900' },
  getItTitle: { fontSize: 18, fontWeight: '800', color: '#2B3148' },
  getItNote: { color: '#6F7F8E', marginTop: 2, lineHeight: 20 },

  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#E9EEF5',
    marginRight: 12,
  },

  shipmentBlock: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8ECEF',
  },
  shipDate: { color: '#2B3148', marginBottom: 4 },
  shipStatus: { color: '#8A95A2', marginBottom: 10 },
  itemRow: { flexDirection: 'row', alignItems: 'center' },
  itemThumb: {
    width: 68,
    height: 68,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#F2F4F7',
  },
  itemBrand: { color: '#5A6472', marginBottom: 2 },
  itemTitle: { color: '#2B3148' },
  viewMore: { color: '#4976F5', marginLeft: 10 },

  helpBubble: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    backgroundColor: '#FFD900',
    borderRadius: 28,
    paddingHorizontal: 18,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  helpIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFE873',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '900',
    color: '#2B3148',
    marginRight: 8,
    includeFontPadding: false,
    lineHeight: 28,
  },
  helpText: { fontWeight: '900', color: '#2B3148' },
});
