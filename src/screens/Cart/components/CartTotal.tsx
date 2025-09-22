import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DirhamLogo from '../../../icons/Dirham'; // <-- same icon you used above
import { getCairoFont } from '../../../ultis/getFont';
import { t } from 'i18next';
import { useLanguage } from '../../../LanguageProvider';

const { width: W } = Dimensions.get('window');

type Props = {
  itemCount: number;
  subtotal: number;
  shippingFee?: number | 'FREE';
  total: number;
  cashbackAmount?: number;           // e.g. 192.58
  onApplyCoupon?: (code: string) => void;
  onViewDiscounts?: () => void;
  onApplyCard?: () => void;
};

export default function CartTotals({
  itemCount,
  subtotal,
  shippingFee = 'FREE',
  total,
//   cashbackAmount,
  onApplyCoupon,
  onViewDiscounts,
//   onApplyCard,
}: Props) {
  const [code, setCode] = useState('');

  const { isRTL } = useLanguage()

  return (
    <View style={s.wrap}>
      {/* Coupon */}
      <View style={s.card}>
        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder={t('enterCoupon')}
          placeholderTextColor="#9CA3AF"
          style={[s.input, isRTL ? {textAlign: 'right'} : undefined, getCairoFont('600')]}
        />
        <TouchableOpacity onPress={() => onApplyCoupon?.(code)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={[s.apply, getCairoFont('400')]}>{t('apply')}</Text>
        </TouchableOpacity>
      </View>

      {/* View discounts */}
      <TouchableOpacity style={s.card} onPress={onViewDiscounts} activeOpacity={0.9}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={s.leftIcon}>
            <Ionicons name="pricetag-outline" size={16} color="#2D6CB5" />
          </View>
          <Text style={[s.viewDiscounts, getCairoFont('600')]}>{t('viewDiscounts')}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
      </TouchableOpacity>

      {/* Totals */}
      <View style={s.totalCard}>
        {/* Subtotal */}
        <View style={s.row}>
          <Text style={[s.subLabel, getCairoFont('700')]}>
            {t('subTotal')} <Text style={[s.muted, getCairoFont('700')]}>({t('items', { count: itemCount })})</Text>
          </Text>
          <Text style={s.amount}>{ isRTL ? 'د' : <DirhamLogo size={12} />} {fmt(totalNumber(subtotal))}</Text>
        </View>

        {/* Shipping */}
        <View style={[s.row, { marginTop: 6 }]}>
          <Text style={[s.subLabel, getCairoFont('700')]}>{t('shipFee')}</Text>
          {shippingFee === 'FREE' ? (
            <Text style={s.free}>{t('free')}</Text>
          ) : (
            <Text style={s.amount}><DirhamLogo size={12} /> {fmt(totalNumber(shippingFee as number))}</Text>
          )}
        </View>

        {/* Divider */}
        <View style={s.hr} />

        {/* Total */}
        <View style={s.row}>
          <Text style={[s.totalTxt, getCairoFont('700')]}>
            {t('total')} 
            {/* <Text style={s.muted}>(Incl. VAT)</Text> */}
          </Text>
          <Text style={s.totalAmt}>{isRTL ? 'د' : <DirhamLogo size={13} />} {fmt(totalNumber(total))}</Text>
        </View>

        {/* Cashback strip */}
        {/* {!!cashbackAmount && (
          <View style={s.cashWrap}>
            <View style={s.cashRow}>
              <Text style={s.cashTitle}>noon One Credit Card Cashback</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="lock-closed-outline" size={14} color="#111" />
                <Text style={s.cashAmt}><DirhamLogo size={12} /> {fmt(cashbackAmount)}</Text>
              </View>
            </View>
            <Text style={s.cashHint}>
              Unlock with noon One Credit Card.{' '}
              <Text onPress={onApplyCard} style={s.link}>Apply Now.</Text>
            </Text>
          </View>
        )} */}
      </View>
    </View>
  );
}

/* utils */
const fmt = (n: number) =>
  n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const totalNumber = (n: number) => Math.round(n * 100) / 100;

/* styles */
const s = StyleSheet.create({
  wrap: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 24,
    backgroundColor: '#F6F7FB',
  },

  /* simple white cards */
  card: {
    width: W - 24,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  apply: { color: '#2D6CB5' },

  leftIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  viewDiscounts: { color: '#2D6CB5' },

  /* totals card */
  totalCard: {
    width: W - 24,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  subLabel: { fontSize: 14, color: '#0F172A' },
  muted: { color: '#9CA3AF', fontWeight: '700' },
  amount: { fontSize: 14, color: '#0F172A', fontWeight: '800' },
  free: { fontSize: 14, color: '#16A34A', fontWeight: '900' },

  hr: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },

  totalTxt: { fontSize: 18, color: '#0F172A' },
  totalAmt: { fontSize: 18, color: '#0F172A', fontWeight: '900' },

  /* cashback strip */
  cashWrap: {
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: '#ECF9E8',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  cashRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cashTitle: { fontWeight: '800', color: '#0F172A' },
  cashAmt: { fontWeight: '800', color: '#0F172A' },
  cashHint: { marginTop: 6, color: '#6B7280' },
  link: { color: '#2D6CB5', fontWeight: '800' },
});
