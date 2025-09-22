import { View, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const COLORS = {
    text: '#0F172A',
    sub: '#6B7280',
    blue: '#2D6CB5',
    green: '#16A34A',
    yellow: '#FFE500',
    line: '#E5E7EB',
    card: '#FFFFFF',
    bg: '#F6F7FB',
    soft: '#F3F4F6',
    danger: '#EF4444',
};

export default function Card({
    title,
    right,
    children,
    tint,
    info,
  }: {
    title?: React.ReactNode;
    right?: React.ReactNode;
    children?: React.ReactNode;
    tint?: boolean;
    info?: boolean;
  }) {
    return (
      <View style={[s.card, tint && s.cardTint]}>
        {(title || right) && (
          <Row style={{ justifyContent: 'space-between', marginBottom: 8 }}>
            {typeof title === 'string' ? <Text style={[s.cardTitle, getCairoFont('800')]}>{title}</Text> : title}
            {right ?? null}
          </Row>
        )}
        {info ? <Ionicons name="information-circle-outline" size={16} color={COLORS.sub} /> : null}
        {children}
      </View>
    );
  }