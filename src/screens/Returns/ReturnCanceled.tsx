// ReturnDetailsScreen.tsx
import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MC from 'react-native-vector-icons/MaterialCommunityIcons';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useNavigation } from '@react-navigation/native';

export default function ReturnDetailsScreen() {
  const [policyOpen, setPolicyOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const nav = useNavigation<any>();
  const rot = useRef(new Animated.Value(policyOpen ? 1 : 0)).current;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  // Enable layout animation on Android
  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const togglePolicy = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const next = !policyOpen;
    setPolicyOpen(next);
    Animated.timing(rot, {
      toValue: next ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={S.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {/* Header */}
      <View style={S.header}>
        <Pressable onPress={() => nav.goBack()} hitSlop={8} style={{padding: 4}}>
          <Ionicons name="chevron-back" size={24} color="#3A3D45" />
        </Pressable>
        <Text style={S.headerTitle}>Return Details</Text>
        <View style={{width: 24}} />
      </View>

      {loading ? (
        <ScrollView contentContainerStyle={{paddingBottom: 28}}>
          <SkeletonPlaceholder borderRadius={10} backgroundColor="#EEF1F6" highlightColor="#F6F8FC">
            {/* Banner row */}
            <SkeletonPlaceholder.Item marginTop={12} paddingHorizontal={16} flexDirection="row" alignItems="center">
              <SkeletonPlaceholder.Item width={24} height={24} borderRadius={12} />
              <SkeletonPlaceholder.Item marginLeft={10}>
                <SkeletonPlaceholder.Item width={140} height={14} />
                <SkeletonPlaceholder.Item marginTop={6} width={220} height={12} />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>

            {/* Timeline */}
            <SkeletonPlaceholder.Item marginTop={16} paddingHorizontal={16}>
              <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
                <SkeletonPlaceholder.Item width={22} height={22} borderRadius={11} />
                <SkeletonPlaceholder.Item flex={1} height={3} marginHorizontal={8} />
                <SkeletonPlaceholder.Item width={22} height={22} borderRadius={11} />
              </SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" marginTop={10}>
                <SkeletonPlaceholder.Item width={80} height={12} />
                <SkeletonPlaceholder.Item width={80} height={12} />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>

            {/* Item card */}
            <SkeletonPlaceholder.Item marginTop={16} paddingHorizontal={16}>
              <SkeletonPlaceholder.Item flexDirection="row" padding={12} borderRadius={12}>
                <SkeletonPlaceholder.Item width={64} height={64} borderRadius={10} />
                <SkeletonPlaceholder.Item marginLeft={12} flex={1}>
                  <SkeletonPlaceholder.Item width="95%" height={12} />
                  <SkeletonPlaceholder.Item marginTop={8} width="85%" height={12} />
                  <SkeletonPlaceholder.Item marginTop={8} width={80} height={12} alignSelf="flex-end" />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>

            {/* Rows */}
            {[1, 2].map((i) => (
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

            {/* Policy card bullets */}
            <SkeletonPlaceholder.Item marginTop={10} marginHorizontal={16} padding={12} borderRadius={12}>
              {[1,2,3].map((b) => (
                <SkeletonPlaceholder.Item key={b} flexDirection="row" alignItems="center" marginTop={b===1?0:8}>
                  <SkeletonPlaceholder.Item width={6} height={6} borderRadius={3} />
                  <SkeletonPlaceholder.Item marginLeft={8} flex={1} height={12} />
                </SkeletonPlaceholder.Item>
              ))}
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        </ScrollView>
      ) : (
      <ScrollView contentContainerStyle={{paddingBottom: 28}}>
        {/* Banner - Return cancelled */}
        <View style={S.banner}>
          <View style={S.bannerIcon}>
            <Ionicons name="alert" size={18} color="#fff" />
          </View>
          <View style={{flex: 1}}>
            <Text style={S.bannerTitle}>Return cancelled</Text>
            <Text style={S.bannerSub}>Your return was cancelled as per your request.</Text>
          </View>
        </View>

        {/* Timeline */}
        <View style={S.timelineCard}>
          <View style={S.timelineHeader}>
            <View style={[S.dot, {backgroundColor: '#EF4444'}]}>
              <Ionicons name="alert" size={14} color="#fff" />
            </View>
            <View style={S.line} />
            <View style={[S.dot, {backgroundColor: '#EF4444'}]}>
              <Ionicons name="alert" size={14} color="#fff" />
            </View>

            <Ionicons name="chevron-down" size={20} color="#6B7280" style={{marginLeft: 6}} />
          </View>

          <View style={S.timelineLabels}>
            <View>
              <Text style={[S.tLabel, {color: '#EF4444'}]}>Requested</Text>
              <Text style={S.tDate}>Nov 16</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={[S.tLabel, {color: '#EF4444'}]}>Cancelled</Text>
              <Text style={S.tDate}>Dec 26</Text>
            </View>
          </View>
        </View>

        {/* Item block */}
        <View style={S.itemCard}>
          <Image
            source={{uri: 'https://images.ugreen.com/upload/product/10990/en/fea.png'}}
            style={S.itemImg}
          />
          <View style={{flex: 1, marginLeft: 12}}>
            <Text numberOfLines={3} style={S.itemTitle}>
              iPhone 15 Magsafe Case Clear 【N52 Stronger Magnets】 【Shockproof
              Military-Grade Protection】 iPhone 15 Cover Anti-Yellow & Anti-Scratch,
              Ultra Slim, Magnetic Cover for iPhone 15 6.1 inch Clear Clear
            </Text>

            <View style={S.priceRow}>
              <Text style={S.price}>د.إ 55.20</Text>
            </View>

            <View style={S.soldRow}>
              <Text style={S.sold}>
                Sold by <Text style={S.soldStore}>Ugreen official store</Text>
              </Text>
              <View style={S.badge}><Text style={S.badgeText}>express</Text></View>
            </View>
          </View>
        </View>

        {/* Rows */}
        <Row
          icon={<MC name="file-document-edit-outline" size={18} color="#111827" />}
          title="Return request summary"
          sub="Return details, additional details and images"
          onPress={() => nav.navigate('ReturnSummary')}
        />
        <Row
          icon={<MC name="receipt-text-outline" size={18} color="#111827" />}
          title="View order/invoice summary"
          sub="Find invoice, shipping details here"
          onPress={() => {}}
        />

        {/* Policy */}
        <Pressable style={S.sectionHeader} onPress={togglePolicy} hitSlop={6}>
          <Text style={S.sectionTitle}>Return Policy</Text>
          <Animated.View
            style={{
              transform: [{
                rotate: rot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] })
              }]
            }}
          >
            <Ionicons name={'chevron-down'} size={18} color="#6B7280" />
          </Animated.View>
        </Pressable>

        {policyOpen && (
          <View style={S.policyCard}>
            <Text style={S.policyLead}>
              Please read our general return policies carefully
            </Text>
            <Bullet> The product must be returned in its original retail packaging (in a sealed and closed box)</Bullet>
            <Bullet> The product must not be used/tampered with</Bullet>
            <Bullet> If the item is non-returnable and was received with missing parts or damaged, reach out to customer support for assistance</Bullet>
            <Bullet> Please note that submitting this return request does not guarantee a refund, your refund will be approved or declined after a verification process based on our return policy</Bullet>
          </View>
        )}
      </ScrollView>
      )}
    </SafeAreaView>
  );
}

/* ===== Small components ===== */
function Row({
  icon, title, sub, onPress,
}: {icon: React.ReactNode; title: string; sub: string; onPress: () => void}) {
  return (
    <Pressable onPress={onPress} style={({pressed}) => [S.row, pressed && {opacity: 0.95}]}>
      <View style={S.rowIconWrap}>{icon}</View>
      <View style={{flex: 1}}>
        <Text style={S.rowTitle}>{title}</Text>
        <Text style={S.rowSub}>{sub}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#6B7280" />
    </Pressable>
  );
}

function Bullet({children}:{children: React.ReactNode}) {
  return (
    <View style={S.bulletRow}>
      <View style={S.bulletDot} />
      <Text style={S.bulletText}>{children}</Text>
    </View>
  );
}

/* ===== Styles ===== */
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
  bannerIcon: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#EF4444',
    alignItems: 'center', justifyContent: 'center',
  },
  bannerTitle: {fontSize: 16, fontWeight: '800', color: '#2E3340'},
  bannerSub: {color: '#6B7280', marginTop: 2, fontSize: 12},

  timelineCard: {backgroundColor: '#FFF', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8},
  timelineHeader: {flexDirection: 'row', alignItems: 'center'},
  dot: {width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center'},
  line: {flex: 1, height: 3, backgroundColor: '#EF4444', marginHorizontal: 8, borderRadius: 2},
  timelineLabels: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, marginBottom: 8,
  },
  tLabel: {fontWeight: '800', fontSize: 14},
  tDate: {color: '#9AA1AE', marginTop: 2, fontSize: 12},

  itemCard: {
    backgroundColor: '#FFF', padding: 12, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E8ECF3', flexDirection: 'row',
  },
  itemImg: {width: 64, height: 64, borderRadius: 10, backgroundColor: '#F3F4F6'},
  itemTitle: {color: '#2F3440', fontSize: 14},
  priceRow: {flexDirection: 'row', justifyContent: 'flex-end', marginTop: 6},
  price: {fontWeight: '800', fontSize: 14, color: '#2F3440'},
  soldRow: {flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8},
  sold: {color: '#7B8294', fontSize: 12},
  soldStore: {color: '#2E5BFF', fontWeight: '700'},
  badge: {backgroundColor: '#FFF3C5', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2},
  badgeText: {fontWeight: '700', color: '#111827', fontSize: 11},

  row: {
    marginHorizontal: 16, marginTop: 10, backgroundColor: '#FFF', borderRadius: 12,
    borderWidth: 1, borderColor: '#E8ECF3', padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  rowIconWrap: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: '#F7F9FC',
    alignItems: 'center', justifyContent: 'center',
  },
  rowTitle: {fontWeight: '800', color: '#2F3440', fontSize: 14},
  rowSub: {color: '#7B8294', marginTop: 2, fontSize: 12},

  sectionHeader: {
    marginTop: 14, paddingHorizontal: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
  },
  sectionTitle: {fontSize: 16, fontWeight: '800', color: '#2F3440'},

  policyCard: {
    backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E8ECF3',
    padding: 12, marginHorizontal: 16, marginTop: 10,
  },
  policyLead: {fontWeight: '800', color: '#384152', marginBottom: 10, fontSize: 14},
  bulletRow: {flexDirection: 'row', gap: 8, marginVertical: 6, alignItems: 'flex-start'},
  bulletDot: {width: 6, height: 6, borderRadius: 3, backgroundColor: '#55617A', marginTop: 6},
  bulletText: {flex: 1, color: '#4B5563', fontSize: 13},
});
