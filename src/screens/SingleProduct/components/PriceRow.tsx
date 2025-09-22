import { View, Text, StyleSheet } from "react-native";
import DirhamLogo from "../../../icons/Dirham";
import { getCairoFont } from '../../../ultis/getFont'

export default function PriceRow({
    price,
    oldPrice,
    offText,
  }: {
    price: number | string;
    oldPrice?: number | string;
    offText?: string; // e.g., "8%"
  }) {
    return (
      <View style={s.priceRowWrap}>
        <Text style={[s.heroPrice, getCairoFont('900')]}>
          <DirhamLogo size={14} /> {price}
        </Text>
        {!!oldPrice && <Text style={s.heroOld}>{oldPrice}</Text>}
        {!!offText && (
          <Text style={[s.heroOff, getCairoFont('800')]}>
            {offText}{' '}
            <Text style={{ color: '#6B7280' }}>(Incl. VAT)</Text>
          </Text>
        )}
      </View>
    );
  }

  const s = StyleSheet.create({
    priceRowWrap: {
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        flexDirection: 'row',
        alignItems: 'flex-end',
      },
      heroPrice: { fontSize: 22, color: '#0F172A' },
      heroOld: { marginLeft: 10, color: '#6B7280', textDecorationLine: 'line-through' },
      heroOff: { marginLeft: 8, color: '#16A34A' },
  })