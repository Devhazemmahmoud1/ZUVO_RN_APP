// ReturnDetailsRefundIssuedScreen.tsx
import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView, View, Text, StyleSheet, Pressable, ScrollView, Image, StatusBar,
  LayoutAnimation, Platform, UIManager, Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MC from 'react-native-vector-icons/MaterialCommunityIcons';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useNavigation } from '@react-navigation/native';

export default function ReturnDetailsRefundIssuedScreen() {
  const [refundOpen, setRefundOpen] = useState(true);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const nav = useNavigation<any>();

  // accordion animation state (policy)
  const rot = useRef(new Animated.Value(0)).current;
  const [measured, setMeasured] = useState(false);
  const [contentH, setContentH] = useState(0);
  const hAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const togglePolicy = () => {
    const next = !policyOpen;
    setPolicyOpen(next);
    Animated.timing(rot, {
      toValue: next ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (!measured) return;
    Animated.timing(hAnim, {
      toValue: policyOpen ? contentH : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [policyOpen, measured, contentH]);

  const price = 'د.إ 55.20';

  return (
    <SafeAreaView style={S.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {/* Header */}
      <View style={S.header}>
        <Pressable hitSlop={8} onPress={() => nav.goBack()} style={{padding: 4}}>
          <Ionicons name="chevron-back" size={24} color="#3A3D45" />
        </Pressable>
        <Text style={S.headerTitle}>Return Details</Text>
        <View style={{width: 24}} />
      </View>

      {loading ? (
        <ScrollView contentContainerStyle={{paddingBottom: 28}}>
          <SkeletonPlaceholder borderRadius={10} backgroundColor="#EEF1F6" highlightColor="#F6F8FC">
            {/* Banner */}
            <SkeletonPlaceholder.Item marginTop={12} paddingHorizontal={16} flexDirection="row" alignItems="center">
              <SkeletonPlaceholder.Item width={24} height={24} borderRadius={12} />
              <SkeletonPlaceholder.Item marginLeft={10}>
                <SkeletonPlaceholder.Item width={120} height={14} />
                <SkeletonPlaceholder.Item marginTop={6} width={220} height={12} />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
            {/* Track button */}
            <SkeletonPlaceholder.Item marginTop={10} marginHorizontal={16} height={36} borderRadius={10} />
            {/* Timeline */}
            <SkeletonPlaceholder.Item marginTop={12} paddingHorizontal={16}>
              <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
                <SkeletonPlaceholder.Item width={22} height={22} borderRadius={11} />
                <SkeletonPlaceholder.Item flex={1} height={3} marginHorizontal={8} />
                <SkeletonPlaceholder.Item width={22} height={22} borderRadius={11} />
                <SkeletonPlaceholder.Item flex={1} height={3} marginHorizontal={8} />
                <SkeletonPlaceholder.Item width={22} height={22} borderRadius={11} />
                <SkeletonPlaceholder.Item flex={1} height={3} marginHorizontal={8} />
                <SkeletonPlaceholder.Item width={22} height={22} borderRadius={11} />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
            {/* Item */}
            <SkeletonPlaceholder.Item marginTop={14} paddingHorizontal={16}>
              <SkeletonPlaceholder.Item flexDirection="row" padding={12} borderRadius={12}>
                <SkeletonPlaceholder.Item width={64} height={64} borderRadius={10} />
                <SkeletonPlaceholder.Item marginLeft={12} flex={1}>
                  <SkeletonPlaceholder.Item width="95%" height={12} />
                  <SkeletonPlaceholder.Item marginTop={8} width="90%" height={12} />
                  <SkeletonPlaceholder.Item marginTop={8} width="40%" height={12} />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item width={60} height={14} />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
            {/* Rows */}
            {[1,2].map((i) => (
              <SkeletonPlaceholder.Item key={i} marginTop={12} paddingHorizontal={16}>
                <SkeletonPlaceholder.Item flexDirection="row" padding={12} borderRadius={12} alignItems="center">
                  <SkeletonPlaceholder.Item width={30} height={30} borderRadius={15} />
                  <SkeletonPlaceholder.Item marginLeft={12} flex={1}>
                    <SkeletonPlaceholder.Item width="60%" height={12} />
                    <SkeletonPlaceholder.Item marginTop={6} width="40%" height={12} />
                  </SkeletonPlaceholder.Item>
                  <SkeletonPlaceholder.Item width={12} height={12} borderRadius={6} />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
            ))}
            {/* Policy header */}
            <SkeletonPlaceholder.Item marginTop={16} paddingHorizontal={16}>
              <SkeletonPlaceholder.Item width={140} height={14} />
            </SkeletonPlaceholder.Item>
            {/* Policy card */}
            <SkeletonPlaceholder.Item marginTop={10} marginHorizontal={16} height={110} borderRadius={12} />
          </SkeletonPlaceholder>
        </ScrollView>
      ) : (
      <ScrollView contentContainerStyle={{paddingBottom: 28}}>
        {/* Banner */}
        <View style={S.banner}>
          <View style={[S.circle, {backgroundColor: '#22C55E'}]}>
            <MC name="gift-outline" size={18} color="#fff" />
          </View>
          <View style={{flex: 1}}>
            <Text style={S.bannerTitle}>Refund issued</Text>
            <Text style={S.bannerSub}>We have issued your {price} refund to your payment source.</Text>
          </View>
        </View>
        <Pressable style={S.trackBtn} onPress={() => nav.navigate('RefundTrack')}>
          <Text style={S.trackTxt}>Track refund</Text>
        </Pressable>

        {/* Timeline */}
        <View style={S.timelineCard}>
          <View style={S.timelineRow}>
            <Dot />
            <Connector />
            <Dot />
            <Connector />
            <Dot />
            <Connector />
            <Dot />
            <Ionicons name="chevron-down" size={18} color="#6B7280" style={{marginLeft: 8}} />
          </View>

          <View style={S.labelsRow}>
            <View style={S.labelBox}>
              <Text style={S.labelMain}>Requested</Text>
              <Text style={S.labelSub}>Nov 16</Text>
            </View>
            <View style={[S.labelBox, {alignItems: 'center'}]}>
              <Text style={S.labelMain}>Pickup</Text>
            </View>
            <View style={[S.labelBox, {alignItems: 'center'}]}>
              <Text style={S.labelMain}>Processed</Text>
              <Text style={S.labelSub}>Nov 20</Text>
            </View>
            <View style={[S.labelBox, {alignItems: 'flex-end'}]}>
              <Text style={[S.labelMain, {color: '#22C55E'}]}>Refunded</Text>
              <Text style={S.labelSub}>Jan 23</Text>
            </View>
          </View>
        </View>

        {/* Item summary */}
        <View style={S.itemCard}>
          <Image
            source={{uri: 'https://images.ugreen.com/upload/product/10990/en/fea.png'}}
            style={S.itemImg}
          />
          <View style={{flex: 1, marginLeft: 12}}>
            <Text numberOfLines={4} style={S.itemTitle}>
              iPhone 15 Magsafe Case Clear 【N52 Stronger Magnets】 【Shockproof Military-Grade Protection】
              iPhone 15 Cover Anti-Yellow & Anti-Scratch, Ultra Slim, Magnetic Cover for iPhone 15 6.1 inch Clear Clear
            </Text>
            <View style={S.soldRow}>
              <Text style={S.sold}>
                Sold by <Text style={S.store}>Ugreen official store</Text>
              </Text>
              <View style={S.badge}><Text style={S.badgeText}>express</Text></View>
            </View>
          </View>
          <Text style={S.price}>{price}</Text>
        </View>

        {/* Refund summary (collapsible) */}
        <Pressable style={S.row} onPress={() => setRefundOpen(v => !v)}>
          <View style={S.rowIcon}><MC name="cash-refund" size={18} color="#111827" /></View>
          <View style={{flex: 1}}>
            <Text style={S.rowTitle}>Refund summary</Text>
            <Text style={S.rowSub}>
              Your total estimated refund is <Text style={{color: '#22C55E', fontWeight: '800'}}>{price}</Text>
            </Text>
          </View>
          <Ionicons name={refundOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#6B7280" />
        </Pressable>
        {refundOpen && (
          <View style={S.refundBox}>
            <KV label="Item price" value={price} />
            <KV label="Delivery fee" value="د.إ 0.00" />
            <KV label="Refund method" value="Original payment source" />
          </View>
        )}

        {/* Return request summary */}
        <Pressable style={S.row} onPress={() => nav.navigate('ReturnSummary')}>
          <View style={S.rowIcon}><MC name="file-document-edit-outline" size={18} color="#111827" /></View>
          <View style={{flex: 1}}>
            <Text style={S.rowTitle}>Return request summary</Text>
            <Text style={S.rowSub}>Return details, additional details and images</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </Pressable>

        {/* Invoice row */}
        <Pressable style={S.row} onPress={() => {}}>
          <View style={S.rowIcon}><MC name="receipt-text-outline" size={18} color="#111827" /></View>
          <View style={{flex: 1}}>
            <Text style={S.rowTitle}>View order/invoice summary</Text>
            <Text style={S.rowSub}>Find invoice, shipping details here</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </Pressable>

        {/* Return Policy (collapsed) */}
        <Pressable style={S.sectionHeader} onPress={togglePolicy}>
          <Text style={S.sectionTitle}>Return Policy</Text>
          <Animated.View style={{ transform: [{ rotate: rot.interpolate({ inputRange: [0,1], outputRange: ['0deg','180deg'] }) }] }}>
            <Ionicons name={'chevron-down'} size={18} color="#6B7280" />
          </Animated.View>
        </Pressable>
        <Animated.View style={[S.policyCard, {height: measured ? hAnim : undefined, overflow: 'hidden'}]}>
          <View
            onLayout={(e) => {
              const h = e.nativeEvent.layout.height;
              setContentH(h);
              if (!measured) {
                hAnim.setValue(policyOpen ? h : 0);
                setMeasured(true);
              }
            }}
          >
            <Bullet>Items must be returned in original retail packaging.</Bullet>
            <Bullet>Item must be unused and untampered.</Bullet>
            <Bullet>For damaged/missing parts, contact support.</Bullet>
            <Bullet>Refund approval is subject to verification against policy.</Bullet>
          </View>
        </Animated.View>
      </ScrollView>
      )}
    </SafeAreaView>
  );
}

/* ===== Little pieces ===== */
function KV({label, value}:{label:string; value:string}) {
  return (
    <View style={S.kv}>
      <Text style={S.kvLabel}>{label}</Text>
      <Text style={S.kvVal}>{value}</Text>
    </View>
  );
}
function Dot() {
  return (
    <View style={S.dot}>
      <MC name="gift-outline" size={14} color="#fff" />
    </View>
  );
}
function Connector() { return <View style={S.connector} />; }
function Bullet({children}:{children:React.ReactNode}) {
  return (
    <View style={S.bulletRow}>
      <View style={S.bulletDot} />
      <Text style={S.bulletText}>{children}</Text>
    </View>
  );
}

/* ===== Styles ===== */
const GREEN = '#22C55E';

const S = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#FFFFFF'},
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFF',
    borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E8ECF3',
  },
  headerTitle: {fontSize: 18, fontWeight: '700', color: '#2F3440'},

  banner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFF',
    borderBottomWidth: StyleSheet.hairlineWidth, borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#E8ECF3',
  },
  circle: {
    width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  bannerTitle: {fontSize: 16, fontWeight: '800', color: '#2E3340'},
  bannerSub: {color: '#6B7280', marginTop: 2, fontSize: 12},

  trackBtn: {
    marginHorizontal: 16, marginTop: 10, marginBottom: 12,
    backgroundColor: '#EEF3FF', borderRadius: 10, alignItems: 'center', paddingVertical: 10,
  },
  trackTxt: {color: '#2E5BFF', fontWeight: '800', fontSize: 13},

  timelineCard: {backgroundColor: '#FFF', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E8ECF3', paddingVertical: 10},
  timelineRow: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16},
  dot: {width: 22, height: 22, borderRadius: 11, backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center'},
  connector: {flex: 1, height: 3, backgroundColor: GREEN, marginHorizontal: 8, borderRadius: 2},
  labelsRow: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 10},
  labelBox: {flex: 1},
  labelMain: {fontWeight: '800', color: '#2F3440', fontSize: 14},
  labelSub: {color: '#9AA1AE', marginTop: 2, fontSize: 12},

  itemCard: {
    backgroundColor: '#FFF', padding: 12, borderTopWidth: 1, borderBottomWidth: 1,
    borderColor: '#E8ECF3', flexDirection: 'row', alignItems: 'flex-start', gap: 12,
  },
  itemImg: {width: 64, height: 64, borderRadius: 10, backgroundColor: '#F3F4F6'},
  itemTitle: {color: '#2F3440', fontSize: 14},
  soldRow: {flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8},
  sold: {color: '#7B8294', fontSize: 12},
  store: {color: '#2E5BFF', fontWeight: '700'},
  price: {fontWeight: '800', color: '#2F3440', fontSize: 14},
  badge: {backgroundColor: '#FFF3C5', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3},
  badgeText: {fontWeight: '700', color: '#111827', fontSize: 12},

  row: {
    marginHorizontal: 16, marginTop: 12, backgroundColor: '#FFF', borderRadius: 12,
    borderWidth: 1, borderColor: '#E8ECF3', padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  rowIcon: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: '#F7F9FC',
    alignItems: 'center', justifyContent: 'center',
  },
  rowTitle: {fontWeight: '800', color: '#2F3440', fontSize: 14},
  rowSub: {color: '#7B8294', marginTop: 2, fontSize: 12},

  refundBox: {marginHorizontal: 16, borderLeftWidth: 2, borderLeftColor: '#E8ECF3', paddingLeft: 12, paddingTop: 6},
  kv: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6},
  kvLabel: {color: '#6B7280'},
  kvVal: {fontWeight: '700', color: '#2F3440'},

  sectionHeader: {
    marginTop: 14, paddingHorizontal: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
  },
  sectionTitle: {fontSize: 16, fontWeight: '800', color: '#2F3440'},
  policyCard: {
    marginHorizontal: 16, marginTop: 10, backgroundColor: '#FFF', borderRadius: 12,
    borderWidth: 1, borderColor: '#E8ECF3', padding: 12,
  },
  bulletRow: {flexDirection: 'row', gap: 8, marginVertical: 6, alignItems: 'flex-start'},
  bulletDot: {width: 6, height: 6, borderRadius: 3, backgroundColor: '#55617A', marginTop: 6},
  bulletText: {flex: 1, color: '#4B5563', fontSize: 13},
});
