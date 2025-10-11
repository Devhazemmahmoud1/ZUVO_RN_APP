// RefundDetailsScreen.tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const CURRENCY = 'د.إ';
const ORDER_TOTAL = `${CURRENCY} 349.20`;
const REFUND_AMOUNT = `${CURRENCY} 55.20`;

export default function RefundDetailsScreen() {
  const nav = useNavigation<any>();
  return (
    <SafeAreaView style={S.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {/* Header */}
      <View style={S.header}>
        <Pressable hitSlop={8} style={{padding: 4}} onPress={() => nav.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#3A3D45" />
        </Pressable>
        <Text style={S.headerTitle}>Refund details</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView contentContainerStyle={{paddingBottom: 28}}>
        {/* Order total */}
        <View style={S.block}>
          <View style={S.rowBetween}>
            <Text style={S.h2}>Order total</Text>
            <Text style={S.total}>{ORDER_TOTAL}</Text>
          </View>
          <View style={S.methodRow}>
          <TabbyPill />
          <Text style={S.methodText} numberOfLines={1}>Tabby</Text>
            <Text style={[S.total, {marginLeft: 'auto', color: '#99A1B3'}]}>{ORDER_TOTAL}</Text>
          </View>
        </View>

        {/* Completed refunds */}
        <View style={[S.block, {backgroundColor: '#F7F8FB', borderTopWidth: 0}]}>
          <Text style={S.h2}>Completed refunds</Text>
          <Text style={S.helper}>
            Find out items and fees refunded <Text style={S.link} onPress={() => {}}>here</Text>
          </Text>

          <View style={S.refCard}>
            <View style={S.iconSquare}>
              <TabbyPill />
            </View>
            <View style={{flex: 1, marginLeft: 12}}>
              <Text style={S.refAmount}>{REFUND_AMOUNT}</Text>
              <Text style={S.refTo}>Processed to Tabby</Text>
              <Text style={S.refText}>
                Your refund was processed to tabby on <Text style={{fontWeight: '800'}}>Monday, 20th Nov</Text>. Contact tabby for further support
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Tiny pieces ---------- */
function TabbyPill() {
  return (
    <View style={S.tabby}>
      <Text style={S.tabbyTxt}>tabby</Text>
    </View>
  );
}

/* ---------- Styles ---------- */
const S = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#FFFFFF'},

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E8ECF3',
    backgroundColor: '#FFF',
  },
  headerTitle: {fontSize: 18, fontWeight: '700', color: '#2F3440'},

  block: {paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, borderTopWidth: 6, borderTopColor: '#F4F6FA'},
  rowBetween: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  h2: {fontSize: 16, fontWeight: '800', color: '#2F3440'},
  total: {fontWeight: '800', color: '#2F3440', fontSize: 14},

  methodRow: {flexDirection: 'row', alignItems: 'center', marginTop: 10},
  methodText: {color: '#6A7386', marginLeft: 8, fontSize: 12, flexShrink: 0},

  tabby: {backgroundColor: '#17D36B', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start'},
  tabbyTxt: {fontWeight: '900', color: '#0B1220', letterSpacing: 0.3, fontSize: 12, includeFontPadding: false},

  helper: {color: '#7B8294', marginTop: 6, fontSize: 12},

  refCard: {
    marginTop: 10, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#E8ECF3', flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: {width: 0, height: 3}, shadowRadius: 8,
  },
  iconSquare: {
    width: 42, height: 42, borderRadius: 10, backgroundColor: '#F4F6FA',
    alignItems: 'center', justifyContent: 'center',
  },
  refAmount: {fontWeight: '800', color: '#2F3440', fontSize: 14},
  refTo: {color: '#7B8294', marginTop: 2, fontSize: 12},
  refText: {color: '#2F3440', marginTop: 8, lineHeight: 18, fontSize: 13},

  link: {color: '#2E5BFF', fontWeight: '700'},
});
