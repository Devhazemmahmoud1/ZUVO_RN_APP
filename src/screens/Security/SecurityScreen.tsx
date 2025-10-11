// SecuritySettingsScreen.tsx
import React from 'react';
import {
  SafeAreaView, View, Text, StyleSheet, Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

export default function SecuritySettingsScreen() {
  const nav = useNavigation<any>();

  return (
    <SafeAreaView style={S.safe}>
      {/* Header */}
      <View style={S.header}>
        <Pressable onPress={() => nav.goBack()} hitSlop={8} style={{padding: 4}}>
          <Ionicons name="chevron-back" size={24} color="#3A3D45" />
        </Pressable>
        <Text style={S.headerTitle}>Security Settings</Text>
        <View style={{width: 24}} />
      </View>

      {/* Account Deletion */}
      <View style={S.card}>
        <Text style={S.cardTitle}>Account Deletion</Text>
        <Text style={S.cardSub}>We are sad to see you go, but hope to see you again!</Text>
        <Pressable onPress={() => {/* your delete flow */}}>
          <Text style={S.deleteLink}>Delete your account</Text>
        </Pressable>
      </View>

      {/* Change Password */}
      <Pressable style={S.card} onPress={() => nav.navigate('ChangePassword')}>
        <Text style={S.cardTitle}>Change password</Text>
        <View style={S.passRow}>
          <Text style={S.passwordMask}>* * * * * * * * * *</Text>
          <MaterialCommunityIcons
            name="pencil-outline"
            size={18}
            color="#9095A1"
          />
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F4F6FA' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#272A32' },

  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 14, marginTop: 12,
    padding: 12, borderRadius: 12,
    borderWidth: 1, borderColor: '#E9ECF2',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: {width: 0, height: 2},
    elevation: 1,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#2E323B' },
  cardSub: { marginTop: 8, color: '#858B98' },
  deleteLink: { marginTop: 8, color: '#E02424', fontSize: 14, fontWeight: '600' },
  passRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  passwordMask: { letterSpacing: 3, color: '#3A3D45', fontSize: 16 },
});
