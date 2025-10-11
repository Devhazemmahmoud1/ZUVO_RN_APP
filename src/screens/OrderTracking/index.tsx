// TrackingDetailsScreen.tsx
import React, {useMemo} from 'react';
import {
  SafeAreaView, View, Text, StyleSheet, Pressable, ScrollView, Image, Alert, StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation, useRoute } from '@react-navigation/native';

type HeaderMode = 'title' | 'delivered'; // title = "Tracking details", delivered = "Delivered on …"

type Props = {
  headerMode?: HeaderMode;
  itemId?: string;
  deliveredAt?: string; // e.g. "Thursday, 16th Nov, 02:39 PM"
  helpVariant?: 'pill' | 'fab'; // pill = "Need Help?", fab = yellow circle
};

export default function TrackingDetailsScreen({
  headerMode = 'title',
  itemId = 'NAEFB0054305886-1',
  deliveredAt = 'Thursday, 16th Nov, 02:39 PM',
  helpVariant = 'fab',
}: Props) {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const passed = route?.params?.order;
  const orderCode = passed?.orderId || itemId;
  const created = passed?.createdAt ? new Date(passed.createdAt) : null;
  const computedDelivered = created
    ? `on ${created.toLocaleDateString(undefined, { weekday: 'long', day: '2-digit', month: 'short' })}, ${created.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`
    : deliveredAt;
  const statusLabel = useMemo(() => {
    if (passed?.statusLabel) return passed.statusLabel as any;
    const v = String(passed?.status || '').toLowerCase();
    if (v.includes('deliver')) return 'Delivered';
    if (v.includes('cancel')) return 'Cancelled';
    if (v.includes('ship')) return 'Shipped';
    if (v.includes('pending') || v.includes('unpaid') || v.includes('process')) return 'Processing';
    return 'Processing';
  }, [passed?.status, passed?.statusLabel]);

  const statusColor = {
    Delivered: '#16A34A',
    Cancelled: '#EF4444',
    Shipped: '#2563EB',
    Processing: '#F59E0B',
  }[statusLabel as 'Delivered' | 'Cancelled' | 'Shipped' | 'Processing'];

  const statusIcon = {
    Delivered: 'checkmark-done',
    Cancelled: 'close',
    Shipped: 'cube-outline',
    Processing: 'time-outline',
  }[statusLabel as 'Delivered' | 'Cancelled' | 'Shipped' | 'Processing'];
  const DeliveredHeader = useMemo(() => (
    <Text style={S.deliveredHeader}>
      <Text style={{color: '#6B7280'}}>Delivered on{'\n'}</Text>
      <Text style={{color: '#111827'}}>{computedDelivered}</Text>
    </Text>
  ), [computedDelivered]);

  const copyId = () => {
    Clipboard.setString(String(orderCode));
    Alert.alert('Copied', 'Item ID copied to clipboard');
  };

  return (
    <SafeAreaView style={S.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {/* Header */}
      <View style={S.header}>
        <Pressable onPress={() => nav.goBack()} hitSlop={8} style={{padding: 4}}>
          <Ionicons name="chevron-back" size={24} color="#3A3D45" />
        </Pressable>
        {headerMode === 'title'
          ? <Text style={S.headerTitle}>Tracking details</Text>
          : DeliveredHeader}
        <View style={{width: 24}} />
      </View>

      <ScrollView contentContainerStyle={{paddingBottom: 120}} bounces>
        {/* Top bar (Item ID row) */}
        {headerMode === 'title' && (
          <View style={S.topRow}>
            <Text style={S.itemId}>Item ID <Text style={S.itemIdLink}>{orderCode}</Text></Text>
            <Pressable onPress={copyId} hitSlop={8} style={{padding: 6}}>
              <Ionicons name="copy-outline" size={18} color="#6B7280" />
            </Pressable>
          </View>
        )}

        {/* Status row */}
        <View style={S.statusRow}>
          <View style={[S.statusIcon, { backgroundColor: statusColor }]}>
            <Ionicons name={statusIcon as any} size={14} color="#fff" />
          </View>
          <View style={{marginLeft: 14}}>
            <Text style={[S.statusText, { color: statusColor }]}>{statusLabel}</Text>
            <Text style={S.statusDate}>{computedDelivered}</Text>
          </View>
        </View>

        {/* Delivery address */}
        <Section>
          <Text style={S.sectionTitle}>
            Delivery address <Text style={{color: '#5B7CFA'}}>(Home)</Text>
          </Text>
          <Text style={S.addrName}>{passed?.shippingInfo?.receiver?.name || 'Receiver'}</Text>
          <Text style={S.addrText}>
            {(passed?.shippingInfo?.address?.address) || '—'}
          </Text>
          {(passed?.shippingInfo?.receiver?.phone || passed?.shippingInfo?.receiver?.mobile) && (
            <Text style={S.addrText}>
              {passed?.shippingInfo?.receiver?.phone || passed?.shippingInfo?.receiver?.mobile}
            </Text>
          )}
        </Section>

        {/* Share your experience (only for Delivered orders) */}
        {statusLabel === 'Delivered' && (
          <>
            <Text style={[S.sectionHeader, {marginTop: 10, marginBottom: 8}]}>Share your experience</Text>
            <View style={{gap: 12, paddingHorizontal: 16}}>
              <ActionRow
                icon={<MCIcons name="storefront-outline" size={18} color="#111827" />}
                iconTint="#FFE866"
                title="Review seller"
                subtitle="Leave feedback to the seller"
                onPress={() => {}}
              />
              <ActionRow
                icon={<Ionicons name="thumbs-up-outline" size={18} color="#111827" />}
                iconTint="#FFF7BF"
                title="Review product"
                subtitle="Help others know what to buy"
                onPress={() => nav.navigate('ProductReview')}
              />
              <ActionRow
                icon={<MCIcons name="truck-delivery-outline" size={18} color="#111827" />}
                iconTint="#FFF2C2"
                title="Review delivery"
                subtitle="Review how the delivery went"
                onPress={() => {}}
              />
            </View>
          </>
        )}

        {/* Invoice summary row */}
        <Divider />
        <Pressable style={S.invoiceRow} onPress={() => nav.navigate('OrderSummary')}>
          <View>
            <Text style={S.invoiceTitle}>View order/invoice summary</Text>
            <Text style={S.invoiceSub}>Find invoice, shipping details here</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </Pressable>
        <Divider />

        {/* Item summary header */}
        <View style={S.itemHeader}>
          <Text style={S.sectionHeader}>Item summary</Text>
          {statusLabel === 'Delivered' && (
            <Pressable style={S.proofBtn} onPress={() => {}}>
              <Text style={S.proofText}>View proof of delivery</Text>
            </Pressable>
          )}
        </View>

        {/* Product line */}
        <View style={S.productCard}>
          <Image
            source={{uri: passed?.item?.imageUrl || passed?.item?.image || 'https://via.placeholder.com/128'}}
            style={S.productImg}
          />
          <View style={{flex: 1, marginLeft: 12}}>
            <Text style={S.brand}>{passed?.item?.brand || passed?.brand || ''}</Text>
            <Text numberOfLines={2} style={S.productTitle}>
              {passed?.item?.productName_en || passed?.item?.productName_ar || passed?.title || ''}
            </Text>
            {passed?.item?.productSku ? (
              <Text style={S.sku}>SKU: {passed?.item?.productSku}</Text>
            ) : null}
            <View style={S.metaRow}>
              <View style={S.qtyPill}>
                <Text style={S.qtyPillTxt}>Qty {passed?.item?.quantity ?? 1}</Text>
              </View>
              <Text style={S.price}>د.إ {passed?.item?.price || '0.00'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Help button */}
      {helpVariant === 'pill' ? (
        <Pressable style={S.helpPill} onPress={() => {}}>
          <Ionicons name="information-circle-outline" size={20} color="#111827" />
          <Text style={S.helpPillText}>Need Help?</Text>
        </Pressable>
      ) : (
        <Pressable style={S.helpFab} onPress={() => {}}>
          <Ionicons name="chatbubble-ellipses-outline" size={22} color="#111827" />
        </Pressable>
      )}
    </SafeAreaView>
  );
}

/* ---------- Bits ---------- */
function Section({children}: {children: React.ReactNode}) {
  return <View style={S.section}>{children}</View>;
}
function Divider() {
  return <View style={{height: 10, backgroundColor: '#EFF2F7', marginVertical: 12}} />;
}
function ActionRow({
  icon, iconTint, title, subtitle, onPress,
}: {
  icon: React.ReactNode; iconTint: string; title: string; subtitle: string; onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({pressed}) => [S.actionRow, pressed && {opacity: 0.9}]}>
      <View style={[S.actionIcon, {backgroundColor: iconTint}]}>{icon}</View>
      <View style={{flex: 1}}>
        <Text style={S.actionTitle}>{title}</Text>
        <Text style={S.actionSub}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#6B7280" />
    </Pressable>
  );
}

/* ---------- Styles ---------- */
const S = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#FFFFFF'},
  header: {
    paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E7EB',
  },
  headerTitle: {fontSize: 18, fontWeight: '700', color: '#2F3440'},
  deliveredHeader: {
    textAlign: 'center', fontSize: 14, fontWeight: '800', lineHeight: 18,
  },

  topRow: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E8ECF3',
    backgroundColor: '#FFF',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  itemId: {color: '#7B8294', fontWeight: '700', fontSize: 12},
  itemIdLink: {color: '#5B7CFA'},

  statusRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: '#E8ECF3',
  },
  statusIcon: {
    width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#22C55E',
  },
  statusText: {fontSize: 16, fontWeight: '800', color: '#22C55E'},
  statusDate: {color: '#6B7280', marginTop: 2, fontSize: 12},

  section: {
    marginTop: 10, marginHorizontal: 16, backgroundColor: '#FFF',
    borderRadius: 12, borderWidth: 1, borderColor: '#E8ECF3',
    padding: 12,
  },
  sectionHeader: {marginHorizontal: 16, marginTop: 12, fontSize: 16, fontWeight: '800', color: '#2F3440'},
  sectionTitle: {fontSize: 16, fontWeight: '800', color: '#2F3440'},
  addrName: {marginTop: 8, color: '#2F3440', fontWeight: '700'},
  addrText: {marginTop: 6, color: '#4B5563', fontSize: 13},

  actionRow: {
    backgroundColor: '#FFF', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#E8ECF3',
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  actionIcon: {
    width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center',
  },
  actionTitle: {fontWeight: '800', color: '#2F3440', fontSize: 14},
  actionSub: {color: '#7B8294', fontSize: 12},

  invoiceRow: {
    marginHorizontal: 16, backgroundColor: '#FFF', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#E8ECF3',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  invoiceTitle: {fontSize: 14, fontWeight: '800', color: '#2F3440'},
  invoiceSub: {color: '#8A92A6', marginTop: 4, fontSize: 12},

  itemHeader: {
    marginTop: 4, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
  },
  proofBtn: {
    backgroundColor: '#EEF3FF', paddingVertical: 6, paddingHorizontal: 10,
    borderRadius: 10, borderWidth: 1, borderColor: '#DFE7FF',
  },
  proofText: {color: '#2E5BFF', fontWeight: '700', fontSize: 12},

  productCard: {
    marginTop: 12, marginHorizontal: 16, backgroundColor: '#FFF', borderRadius: 12,
    borderWidth: 1, borderColor: '#E8ECF3', padding: 10, flexDirection: 'row',
  },
  productImg: {width: 84, height: 84, borderRadius: 10, backgroundColor: '#F3F4F6'},
  brand: {color: '#8B92A3', fontWeight: '700', fontSize: 12},
  productTitle: {color: '#2F3440', marginTop: 2, fontSize: 14},
  metaRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10},
  price: {fontWeight: '800', fontSize: 16, color: '#2F3440'},
  sku: {color: '#7B8294', fontSize: 12, marginTop: 4},
  qtyPill: {backgroundColor: '#F1F5F9', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4},
  qtyPillTxt: {color: '#111827', fontWeight: '700', fontSize: 12},

  helpPill: {
    position: 'absolute', right: 16, bottom: 20,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: '#F7B500', borderRadius: 20,
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: {width: 0, height: 5},
  },
  helpPillText: {fontWeight: '800', color: '#111827', fontSize: 13},
  helpFab: {
    position: 'absolute', right: 18, bottom: 26,
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#F7D419',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: {width: 0, height: 6},
  },
});
