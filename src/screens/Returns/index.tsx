// ReturnsScreen.tsx
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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type ReturnStatus = 'Refunded' | 'Cancelled';
type ReturnItem = {
  id: string;
  returnId: string;
  status: ReturnStatus;
  subtitle: string;
  year: number;
  thumb: string;
};

const MOCK: ReturnItem[] = [
  {
    id: '1',
    returnId: 'RIAEFB00615762',
    status: 'Refunded',
    subtitle: 'Refund issued',
    year: 2023,
    thumb:
      'https://images.ugreen.com/upload/product/10990/en/fea.png',
  },
  {
    id: '2',
    returnId: 'RIAEFB00085638',
    status: 'Cancelled',
    subtitle: 'Return cancelled as requested',
    year: 2023,
    thumb:
      'https://images.ugreen.com/upload/product/10990/en/fea.png',
  },
];

export default function ReturnsScreen() {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState<number>(2023);
  const [yearOpen, setYearOpen] = useState(false);
  const nav = useNavigation<any>();

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK.filter(r => r.year === year).filter(r =>
      r.returnId.toLowerCase().includes(q),
    );
  }, [query, year]);

  return (
    <SafeAreaView style={S.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {/* Header */}
      <View style={S.header}>
        <Pressable hitSlop={8} style={{padding: 4}} onPress={() => nav.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#3A3D45" />
        </Pressable>
        <Text style={S.headerTitle}>Returns</Text>
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

        <Pressable style={S.yearBtn} onPress={() => setYearOpen(true)}>
          <Text style={S.yearText}>{year}</Text>
          <Ionicons name="chevron-down" size={18} color="#596070" />
        </Pressable>
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={i => i.id}
        contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 140}}
        ItemSeparatorComponent={() => <View style={{height: 12}} />}
        renderItem={({item}) => <ReturnCard item={item} />}
      />

      {/* Help pill */}
      <Pressable style={S.helpPill} onPress={() => {}}>
        <Ionicons name="information-circle-outline" size={20} color="#111827" />
        <Text style={S.helpText}>Need Help?</Text>
      </Pressable>

      {/* Bottom CTA */}
      <Pressable style={S.cta} onPress={() => {}}>
        <Text style={S.ctaText}>CREATE A NEW RETURN</Text>
      </Pressable>

      {/* Year picker */}
      <Modal visible={yearOpen} transparent animationType="fade">
        <Pressable style={S.modalBg} onPress={() => setYearOpen(false)}>
          <View style={S.modalCard}>
            {[2025, 2024, 2023, 2022].map(y => (
              <Pressable
                key={y}
                onPress={() => { setYear(y); setYearOpen(false); }}
                style={S.modalRow}
              >
                <Text style={[
                  S.modalYear,
                  year === y && {color: '#111827', fontWeight: '700'},
                ]}>
                  {y}
                </Text>
                {year === y && <Ionicons name="checkmark" size={18} color="#111827" />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function ReturnCard({item}: {item: ReturnItem}) {
  const nav = useNavigation<any>();
  const isRefunded = item.status === 'Refunded';
  const color = isRefunded ? '#16A34A' : '#EF4444';
  const icon = isRefunded ? (
    <MaterialCommunityIcons name="cash-refund" size={14} color="#fff" />
  ) : (
    <Ionicons name="alert" size={14} color="#fff" />
  );

  const onPressCard = () => {
    if (isRefunded) {
      nav.navigate('ReturnIssued');
    } else {
      nav.navigate('ReturnCanceled');
    }
  };

  return (
    <Pressable style={({pressed}) => [S.card, pressed && {opacity: 0.95}]} onPress={onPressCard}>
      <Text style={S.returnId}>
        Return ID - <Text style={{fontWeight: '700'}}>{item.returnId}</Text>
      </Text>

      <View style={S.cardRow}>
        <Image source={{uri: item.thumb}} style={S.thumb} />

        <View style={{flex: 1, marginLeft: 12}}>
          <View style={S.statusRow}>
            <View style={[S.statusIcon, {backgroundColor: color}]}>{icon}</View>
            <Text style={[S.statusText, {color}]}>{item.status}</Text>
          </View>
          <Text style={S.subtitle}>{item.subtitle}</Text>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#6B7280" />
      </View>
    </Pressable>
  );
}

/* ----------------- styles ----------------- */
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

  controls: {flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 8, marginTop: 8},
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

  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1, borderColor: '#E8ECF3',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: {width: 0, height: 2},
  },
  returnId: {color: '#8A92A6', marginBottom: 8, fontWeight: '600', fontSize: 12},
  cardRow: {flexDirection: 'row', alignItems: 'center'},
  thumb: {width: 56, height: 56, borderRadius: 10, backgroundColor: '#F3F4F6'},
  statusRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  statusIcon: {width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center'},
  statusText: {fontSize: 14, fontWeight: '800'},
  subtitle: {color: '#6B7280', marginTop: 4, fontSize: 12},

  helpPill: {
    position: 'absolute', right: 16, bottom: 88,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: '#F7B500', borderRadius: 20,
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: {width: 0, height: 5},
  },
  helpText: {fontWeight: '800', color: '#111827', fontSize: 13},

  cta: {
    position: 'absolute', left: 16, right: 16, bottom: 24,
    backgroundColor: '#2563EB', borderRadius: 12, alignItems: 'center', paddingVertical: 14,
  },
  ctaText: {color: '#fff', fontWeight: '800', letterSpacing: 0.6},

  modalBg: {flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center'},
  modalCard: {width: 220, backgroundColor: '#FFF', borderRadius: 14, paddingVertical: 8, borderWidth: 1, borderColor: '#E8ECF3'},
  modalRow: {paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  modalYear: {color: '#596070', fontSize: 15},
});
