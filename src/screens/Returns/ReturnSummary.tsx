// ReturnRequestSummaryScreen.tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function ReturnRequestSummaryScreen() {
  const nav = useNavigation<any>();
  return (
    <SafeAreaView style={S.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {/* Header */}
      <View style={S.header}>
        <Pressable onPress={() => nav.goBack()} hitSlop={8} style={{padding: 4}}>
          <Ionicons name="chevron-back" size={24} color="#3A3D45" />
        </Pressable>
        <Text style={S.headerTitle}>Return request summary</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView contentContainerStyle={{paddingBottom: 28}}>
        {/* Product summary block */}
        <View style={S.productCard}>
          <View style={{flexDirection: 'row', alignItems: 'flex-start', gap: 12}}>
            <Image
              source={{uri: 'https://images.ugreen.com/upload/product/10990/en/fea.png'}}
              style={S.pImg}
            />
            <View style={{flex: 1}}>
              <Text numberOfLines={3} style={S.pTitle}>
                iPhone 15 Magsafe Case Clear 【N52 Stronger Magnets】 【Shockproof
                Military-Grade Protection】 iPhone 15 Cover Anti-Yellow & Anti-Scratch,
                Ultra Slim, Magnetic Cover for iPhone 15 6.1 inch Clear Clear
              </Text>
              <View style={S.soldRow}>
                <Text style={S.soldText}>
                  Sold by <Text style={S.store}>Ugreen official store</Text>
                </Text>
                <View style={S.badge}><Text style={S.badgeText}>express</Text></View>
              </View>
            </View>

            <Text style={S.price}>د.إ 55.20</Text>
          </View>
        </View>

        {/* Return request details */}
        <SectionTitle title="Return request details" />

        <KV label="Requested date" value="16 Nov 2023" />
        <KV label="Return ID" value="RIAEFB00615762" link />
        <KV label="Return reason" value="Product is no longer needed" dim />
        <KV label="Specific reason" value="I changed my mind" dim />
        <KV
          label="Comments"
          value="About the packing i had to open up the packing case by cutting the tapping to take out the item .."
          dim
        />
        <View style={S.kv}>
          <Text style={S.kvLabel}>Pickup address</Text>
          <Text style={[S.kvValue, S.dim]}>
            sadaf 4 building , 25th floor, apartment number 2504,Dubai,United Arab Emirates{'\n'}
            +971-52-1653509 <Text style={S.verified}>Verified</Text>
          </Text>
        </View>

        <Divider />

        {/* Additional details */}
        <SectionTitle title="Additional details" />
        <QA
          question="Does the item have all associated tags?"
          answer="Yes"
        />
        <Line />
        <QA
          question="Is the item still in its original packaging, sealed and brand new?"
          answer="No"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Small building blocks ---------- */
function SectionTitle({title}:{title:string}) {
  return (
    <View style={S.sectionTitleWrap}>
      <Text style={S.sectionTitle}>{title}</Text>
    </View>
  );
}
function KV({label, value, link, dim}:{label:string; value:string; link?:boolean; dim?:boolean}) {
  return (
    <View style={S.kv}>
      <Text style={S.kvLabel}>{label}</Text>
      <Text style={[S.kvValue, dim && S.dim, link && S.link]}>{value}</Text>
    </View>
  );
}
function Divider() {
  return <View style={S.divider} />;
}
function Line() {
  return <View style={S.line} />;
}
function QA({question, answer}:{question:string; answer:'Yes'|'No'}) {
  const isYes = answer === 'Yes';
  return (
    <View style={S.qaRow}>
      <Text style={S.qaQ}>{question}</Text>
      <Text style={[S.qaA, {color: isYes ? '#2E5BFF' : '#2E5BFF'}]}>{answer}</Text>
    </View>
  );
}

/* ---------- Styles ---------- */
const S = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#FFFFFF'},

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E8ECF3',
    backgroundColor: '#FFF',
  },
  headerTitle: {fontSize: 18, fontWeight: '700', color: '#2F3440'},

  productCard: {
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFF',
    borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E8ECF3',
  },
  pImg: {width: 56, height: 56, borderRadius: 10, backgroundColor: '#F3F4F6'},
  pTitle: {color: '#2F3440', fontSize: 14},
  soldRow: {flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6},
  soldText: {color: '#8A92A6', fontSize: 12},
  store: {color: '#2E5BFF', fontWeight: '700'},
  badge: {backgroundColor: '#FFF3C5', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2},
  badgeText: {fontWeight: '700', color: '#111827', fontSize: 11},
  price: {marginLeft: 8, fontWeight: '800', color: '#2F3440', fontSize: 14},

  sectionTitleWrap: {paddingHorizontal: 16, paddingTop: 14},
  sectionTitle: {fontSize: 16, fontWeight: '800', color: '#2F3440'},

  kv: {paddingHorizontal: 16, paddingTop: 12},
  kvLabel: {color: '#2F3440', fontWeight: '700', fontSize: 13},
  kvValue: {marginTop: 6, color: '#2F3440', fontSize: 14},
  dim: {color: '#7B8294'},
  link: {color: '#2E5BFF', fontWeight: '700'},

  verified: {color: '#16A34A', fontWeight: '700'},

  divider: {height: 10, backgroundColor: '#EFF2F7', marginVertical: 14},
  line: {height: 1, backgroundColor: '#E8ECF3', marginHorizontal: 16},

  qaRow: {paddingHorizontal: 16, paddingVertical: 12},
  qaQ: {color: '#2F3440', fontWeight: '700', fontSize: 14},
  qaA: {marginTop: 6, fontSize: 14, fontWeight: '700', color: '#2E5BFF'},
});
