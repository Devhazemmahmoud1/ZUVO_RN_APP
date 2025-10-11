import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import { t } from 'i18next';
import { useNavigation } from '@react-navigation/native';

export default function PaymentMethodsScreen() {
  const navigation = useNavigation<any>();
  const [defaultCard, setDefaultCard] = useState<'5730' | '2594'>('2594');
  const [delete5730, setDelete5730] = useState(false);
  const [delete2594, setDelete2594] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.brandTitle}>{t('app') ?? 'Zuvo'}</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Card 1 — Mastercard */}
        <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.title}>
            Card ending in <Text style={styles.bold}>5730</Text>
          </Text>
          <MCI name="mastercard" size={26} color="#FF5F00" />
        </View>

        <Text style={styles.expiryLabel}>Expiry</Text>
        <Text style={styles.expiryValue}>Mar, 2028</Text>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Ionicons name="trash-outline" size={18} color="#6B7280" />
          <View style={styles.switchSmall}>
            <Switch
              value={delete5730}
              onValueChange={setDelete5730}
              trackColor={{false: '#E5E7EB', true: '#D1D5DB'}}
              thumbColor={delete5730 ? '#9CA3AF' : (Platform.OS === 'android' ? '#FFFFFF' : undefined)}
            />
          </View>
        </View>
      </View>

        {/* Card 2 — Visa (Default) */}
        <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.title}>
            Card ending in <Text style={styles.bold}>2594</Text>
          </Text>
          <MCI name="visa" size={30} color="#1D4ED8" />
        </View>

        <Text style={styles.expiryLabel}>Expiry</Text>
        <Text style={styles.expiryValue}>May, 2028</Text>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Ionicons name="trash-outline" size={18} color="#6B7280" />

          <View style={styles.defaultWrap}>
            <Text style={styles.defaultLabel}>DEFAULT</Text>
            <View style={styles.switchSmall}>
              <Switch
                value={defaultCard === '2594'}
                onValueChange={v => setDefaultCard(v ? '2594' : '5730')}
                trackColor={{false: '#E5E7EB', true: '#2563EB'}}
                thumbColor={Platform.select({ ios: undefined, android: '#FFFFFF' })}
              />
            </View>
          </View>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TabItem({
  label,
  icon,
  active = false,
  activeColor = '#6B7280',
}: {
  label: string;
  icon: string;
  active?: boolean;
  activeColor?: string;
}) {
  const color = active ? activeColor : '#6B7280';
  return (
    <View style={styles.tabItem}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={[styles.tabLabel, {color}]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#FFFFFF'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {padding: 4, marginRight: 8},
  brandTitle: {fontSize: 20, fontWeight: '700', color: '#111827'},
  content: {paddingTop: 6, paddingBottom: 24},

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  row: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  title: {fontSize: 16, color: '#111827'},
  bold: {fontWeight: '700'},
  expiryLabel: {marginTop: 10, color: '#6B7280', fontWeight: '600', fontSize: 12},
  expiryValue: {marginTop: 2, color: '#374151', fontSize: 14},
  divider: {height: 1, backgroundColor: '#F3F4F6', marginVertical: 14},
  defaultWrap: {flexDirection: 'row', alignItems: 'center', gap: 12},
  defaultLabel: {color: '#2563EB', fontWeight: '700', marginRight: 8, fontSize: 12},
  switchSmall: { transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] },

  tabbar: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 12,
    paddingTop: 8,
  },
  tabItem: {alignItems: 'center', justifyContent: 'center'},
  tabLabel: {fontSize: 12, marginTop: 4},
});
