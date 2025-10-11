// OrdersScreen.tsx
import React, {useMemo, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  Image,
  Modal,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useOrders } from '../../apis/orderApi';
import { getCairoFont } from '../../ultis/getFont';

type OrderStatus = 'Delivered' | 'Cancelled' | 'Processing' | 'Shipped';
type Order = {
  id: string;
  orderId: string;
  brand: string;
  title: string;
  thumb: string;
  status: OrderStatus;
  dateLabel: string;  // e.g. "on Wednesday, 27th Dec, 05:12 PM"
  year: number; // kept for compatibility, not used for filtering
  canReview?: boolean; // show “Share your experience”
  canTrackRefund?: boolean;
  payload?: any; // full data passed to tracking screen
};

// backend → UI status mapper
function mapStatus(raw: any): OrderStatus {
  const v = String(raw || '').toLowerCase();
  if (v.includes('deliver')) return 'Delivered';
  if (v.includes('cancel')) return 'Cancelled';
  if (v.includes('ship')) return 'Shipped';
  return 'Processing';
}

export default function OrdersScreen() {
  const [query, setQuery] = useState('');
  const nav = useNavigation<any>();
  const { data: ordersResp, isPending } = useOrders();

  console.log(ordersResp)

  // Normalize API payload
  const apiOrders = useMemo(() => {
    const raw = ordersResp as any;
    if (!raw) return [] as any[];
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw?.orders)) return raw.orders;
    if (raw?.results && Array.isArray(raw.results)) return raw.results;
    // If backend returns a single order object
    if (raw?.id && raw?.items) return [raw];
    return [] as any[];
  }, [ordersResp]);

  const data = useMemo(() => {
    // Flatten orders so each item is a separate card
    const flattened: Order[] = apiOrders.flatMap((o: any) => {
      const created = new Date(o.createdAt || o.date || Date.now());
      const orderCode = String(o.code || o.orderId || o.number || o.id || '');
      const orderStatus = mapStatus(o.status);
      const items: any[] = Array.isArray(o.items) ? o.items : [];

      return items.map((it: any, idx: number) => {
        const title = it.productName_en || it.productName_ar || it.name || o.title || '';
        const thumb = it.imageUrl || it.image || it.image_url || 'https://via.placeholder.com/128';
        const brand = it.brand || o.brand || (it.productSku || '').split('-')[0] || '';
        const status = mapStatus(it.status) || orderStatus;
        const payload = {
          orderId: orderCode,
          status: o.status || it.status,
          statusLabel: status,
          createdAt: o.createdAt,
          paymentMethod: o.paymentMethod,
          paymentStatus: o.paymentStatus,
          subtotal: o.subtotal,
          shippingTotal: o.shippingTotal,
          taxTotal: o.taxTotal,
          totalAmount: o.totalAmount,
          shippingInfo: o.shippingInfo,
          item: {
            id: it.id,
            productId: it.productId,
            productSku: it.productSku,
            productName_en: it.productName_en,
            productName_ar: it.productName_ar,
            imageUrl: thumb,
            quantity: it.quantity,
            price: it.price,
            status: it.status,
          },
        };
        return {
          id: String(it.id || `${o.id}-${idx}`),
          orderId: orderCode,
          brand,
          title,
          thumb,
          status,
          dateLabel: `on ${created.toLocaleDateString(undefined, { weekday: 'long', day: '2-digit', month: 'short' })}, ${created.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`,
          year: created.getFullYear(),
          canReview: status === 'Delivered',
          canTrackRefund: status === 'Cancelled',
          payload,
        } as Order;
      });
    });

    // Only filter by search query (no year filter)
    return flattened.filter(o => {
      const q = query.trim().toLowerCase();
      return !q || `${o.brand} ${o.title}`.toLowerCase().includes(q) || o.orderId.toLowerCase().includes(q);
    });
  }, [apiOrders, query]);

  return (
    <SafeAreaView style={S.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {/* Header */}
      <View style={S.header}>
        <Pressable hitSlop={8} style={{padding: 4}} onPress={() => nav.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#3A3D45" />
        </Pressable>
        <Text style={S.headerTitle}>Orders</Text>
        <View style={{width: 24}} />
      </View>

      {/* Search + Year */}
      <View style={S.controls}>
        <View style={S.searchWrap}>
          <Ionicons name="search" size={18} color="#9AA1AE" />
          <TextInput
            placeholder="Find items"
            placeholderTextColor="#B7BFCC"
            value={query}
            onChangeText={setQuery}
            style={S.searchInput}
          />
        </View>

      </View>

      {/* Section title */}
      <Text style={S.section}>Completed</Text>

      {/* List / Skeleton */}
      {isPending ? (
        <OrdersSkeleton />
      ) : (
        <FlatList
          data={data}
          keyExtractor={i => i.id}
          contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 120}}
          renderItem={({item}) => <OrderCard order={item} />}
          ItemSeparatorComponent={() => <View style={{height: 14}} />}
        />
      )}

      {/* Help FAB */}
      <Pressable style={({pressed}) => [S.fab, pressed && {opacity: 0.9}]}
                 onPress={() => {/* open support */}}>
        <Ionicons name="information-circle-outline" size={22} color="#111827" />
        <Text style={S.fabText}>Need Help?</Text>
      </Pressable>

      {/* no year selector */}
    </SafeAreaView>
  );
}

function OrdersSkeleton() {
  return (
    <View style={{paddingHorizontal: 16, paddingBottom: 120}}>
      <SkeletonPlaceholder borderRadius={10}>
        {/* controls skeleton */}
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginTop={12}>
          <SkeletonPlaceholder.Item flex={1} height={40} borderRadius={10} />
          <SkeletonPlaceholder.Item width={64} height={40} borderRadius={10} marginLeft={10} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>

      {[1, 2, 3].map(i => (
        <SkeletonPlaceholder key={i} borderRadius={10}>
          <SkeletonPlaceholder.Item marginTop={16} padding={12} borderRadius={12}>
            <SkeletonPlaceholder.Item width={160} height={12} />
            <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginTop={12}>
              <SkeletonPlaceholder.Item width={64} height={64} borderRadius={10} />
              <SkeletonPlaceholder.Item marginLeft={12} flex={1}>
                <SkeletonPlaceholder.Item width="80%" height={14} />
                <SkeletonPlaceholder.Item width="95%" height={12} marginTop={8} />
                <SkeletonPlaceholder.Item width="60%" height={12} marginTop={8} />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      ))}
    </View>
  );
}

function OrderCard({order}: {order: Order}) {
  const nav = useNavigation<any>();
  const statusColor = {
    Delivered: '#16A34A',
    Cancelled: '#F59E0B',
    Processing: '#2563EB',
    Shipped: '#2563EB',
  }[order.status];

  const handleOpenTracking = () => {
    nav.navigate('OrderTracking', { order: order.payload });
  };

  return (
    <Pressable style={S.card} onPress={handleOpenTracking}>
      <Text style={S.orderId}>
        Order ID <Text style={S.orderIdLink}>{order.orderId}</Text>
      </Text>

      <View style={S.row}>
        <Image source={{uri: order.thumb}} style={S.thumb} />

        <View style={{flex: 1, marginLeft: 14}}>
          <Text style={[S.brand, getCairoFont('700')]}>{order.brand}</Text>
          <Text numberOfLines={2} style={[S.title, getCairoFont('700')]}>{order.title}</Text>

          <View style={{marginTop: 8}}>
            <Text style={[S.status, {color: statusColor}]}>{order.status}</Text>
            <Text style={S.date}>{order.dateLabel}</Text>
          </View>
        </View>

        <Pressable hitSlop={8} style={{paddingLeft: 6}} onPress={handleOpenTracking}>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </Pressable>
      </View>

      {order.canReview && (
        <>
          <View style={S.shareRow}>
            <Text style={S.shareLabel}>Share your experience</Text>
          </View>
          <View style={S.pillRow}>
            <Pill label="Seller" onPress={() => {}} />
            <Pill label="Product" onPress={() => {}} />
            <Pill label="Delivery" onPress={() => {}} />
          </View>
        </>
      )}

      {order.canTrackRefund && (
        <Pressable style={[S.refundBtn]} onPress={() => {}}>
          <Text style={S.refundText}>Track refund</Text>
        </Pressable>
      )}
    </Pressable>
  );
}

function Pill({label, onPress}: {label: string; onPress: () => void}) {
  return (
    <Pressable onPress={onPress} style={({pressed}) => [S.pill, pressed && {opacity: 0.85}]}>
      <Text style={S.pillText}>{label}</Text>
    </Pressable>
  );
}

const S = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#FFFFFF'},
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {fontSize: 18, fontWeight: '700', color: '#2F3440'},
  controls: {flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 8},
  searchWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FFF', borderRadius: 10, paddingHorizontal: 12, height: 40,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  searchInput: {flex: 1, color: '#2F3440'},
  yearBtn: {
    paddingHorizontal: 12, height: 40, borderRadius: 10,
    borderWidth: 1, borderColor: '#E3E7EF', backgroundColor: '#FFF',
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  yearText: {fontWeight: '700', color: '#596070'},
  section: {marginTop: 16, marginBottom: 10, paddingHorizontal: 16, color: '#2F3440', fontSize: 16, fontWeight: '800'},

  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1, borderColor: '#E8ECF3',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: {width: 0, height: 2},
  },
  orderId: {color: '#8A92A6', marginBottom: 6, fontWeight: '600', fontSize: 12},
  orderIdLink: {color: '#5B7CFA', fontWeight: '700'},
  row: {flexDirection: 'row', alignItems: 'flex-start'},
  thumb: {width: 64, height: 64, borderRadius: 10, backgroundColor: '#F3F4F6', marginTop: 8},
  brand: {color: '#7C8495', fontWeight: '700', fontSize: 12},
  title: {color: '#2F3440', marginTop: 2, fontSize: 13, lineHeight: 18},
  status: {fontSize: 12, fontWeight: '800'},
  date: {color: '#7B8294', marginTop: 2, fontSize: 12},

  shareRow: {marginTop: 10},
  shareLabel: {color: '#2F3440', fontWeight: '700', fontSize: 13},
  pillRow: {flexDirection: 'row', gap: 8, marginTop: 8},
  pill: {
    flex: 1, alignItems: 'center', paddingVertical: 10,
    backgroundColor: '#EEF3FF', borderRadius: 12, borderWidth: 1, borderColor: '#DFE7FF',
  },
  pillText: {color: '#2E5BFF', fontWeight: '700', fontSize: 13},

  refundBtn: {
    marginTop: 10, backgroundColor: '#EEF2F7', borderRadius: 12,
    alignItems: 'center', paddingVertical: 10, borderWidth: 1, borderColor: '#E4E9F2',
  },
  refundText: {color: '#6A7690', fontWeight: '700', fontSize: 13},

  fab: {
    position: 'absolute', right: 16, bottom: 24,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: '#F7B500', borderRadius: 20,
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: {width: 0, height: 5},
  },
  fabText: {fontWeight: '800', color: '#111827', fontSize: 13},

  modalBg: {flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center'},
  modalCard: {width: 220, backgroundColor: '#FFF', borderRadius: 14, paddingVertical: 8, borderWidth: 1, borderColor: '#E8ECF3'},
  modalRow: {paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  modalYear: {color: '#596070', fontSize: 15},
});
