import React, {useMemo, useState} from 'react';
import {
  SafeAreaView, View, Text, StyleSheet, TextInput, Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { t } from 'i18next';

export default function ChangePasswordScreen() {
  const nav = useNavigation<any>();

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  const [showCur, setShowCur] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConf, setShowConf] = useState(false);

  const hasLen = next.length >= 8;
  const hasSpecial = /[!@#$%^&*()_\-+=\[{\]};:'",.<>/?`~\\|]/.test(next);
  const hasCase = /[a-z]/.test(next) && /[A-Z]/.test(next);
  const hasDigit = /\d/.test(next);
  const matches = next.length > 0 && next === confirm;

  const allValid = useMemo(
    () => current.length > 0 && hasLen && hasSpecial && hasCase && hasDigit && matches,
    [current, hasLen, hasSpecial, hasCase, hasDigit, matches],
  );

  return (
    <SafeAreaView style={S2.safe}>
      {/* Header with back + brand */}
      <View style={S2.header}>
        <Pressable onPress={() => nav.goBack()} hitSlop={8} style={{padding: 4}}>
          <Ionicons name="chevron-back" size={24} color="#3A3D45" />
        </Pressable>
        <Text style={S2.brand}>{t('app') ?? 'Zuvo'}</Text>
        <View style={{width: 24}} />
      </View>

      <Text style={S2.title}>Change Password</Text>

      {/* Fields */}
      <Field
        label="Current Password"
        value={current}
        onChangeText={setCurrent}
        secureTextEntry={!showCur}
        onToggleEye={() => setShowCur(v => !v)}
        icon="lock-closed-outline"
      />
      <Field
        label="New Password"
        value={next}
        onChangeText={setNext}
        secureTextEntry={!showNext}
        onToggleEye={() => setShowNext(v => !v)}
        icon="lock-closed-outline"
      />
      <Field
        label="Confirm New Password"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry={!showConf}
        onToggleEye={() => setShowConf(v => !v)}
        icon="shield-checkmark-outline"
      />

      {/* Requirements */}
      <View style={{marginTop: 18, paddingHorizontal: 16}}>
        <Text style={S2.reqTitle}>Your password must have at least:</Text>
        <Req ok={hasLen} text="8 characters" />
        <Req ok={hasSpecial} text="1 special character (Example: # $ @ & ? )" />
        <Req ok={hasCase} text="1 uppercase and 1 lowercase letter" />
        <Req ok={hasDigit} text="1 numerical digit" />
        <Req ok={matches} text="Matches confirmation" />
      </View>

      {/* Submit */}
      <Pressable
        disabled={!allValid}
        onPress={() => {/* call API then nav.goBack() */}}
        style={({pressed}) => [
          S2.button,
          !allValid ? S2.buttonDisabled : S2.buttonEnabled,
          pressed && allValid ? {opacity: 0.85} : null,
        ]}
      >
        <Text style={[S2.buttonText, !allValid ? S2.buttonTextDisabled : null]}>
          SUBMIT
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

function Field({
  label, value, onChangeText, secureTextEntry, onToggleEye, icon,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry: boolean;
  onToggleEye: () => void;
  icon?: string;
}) {
  return (
    <View style={{paddingHorizontal: 16, marginTop: 14}}>
      <Text style={S2.label}>{label}</Text>
      <View style={S2.inputWrap}>
        {icon ? (
          <View style={S2.leftIcon}>
            <Ionicons name={icon as any} size={18} color="#9AA1AE" />
          </View>
        ) : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          placeholder=""
          style={[S2.input, icon ? {paddingLeft: 38} : null]}
        />
        <Pressable onPress={onToggleEye} hitSlop={8} style={S2.eyeBtn}>
          <MaterialCommunityIcons
            name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#9AA1AE"
          />
        </Pressable>
      </View>
    </View>
  );
}

function Req({ok, text}: {ok: boolean; text: string}) {
  return (
    <View style={S2.reqRow}>
      <MaterialCommunityIcons
        name={ok ? 'check-circle' : 'check-circle-outline'}
        size={18}
        color={ok ? '#22C55E' : '#C9CFDA'}
      />
      <Text style={[S2.reqText, {color: ok ? '#3A3D45' : '#C9CFDA'}]}>{text}</Text>
    </View>
  );
}

const S2 = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F4F6FA' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFF',
  },
  brand: { fontSize: 22, fontWeight: '800', color: '#2E323B' },
  title: { textAlign: 'center', fontSize: 24, fontWeight: '800', color: '#2E323B', marginTop: 6 },

  label: { color: '#3A3D45', marginBottom: 8, fontWeight: '600' },
  inputWrap: {
    position: 'relative',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, shadowOffset: {width: 0, height: 2},
    elevation: 1,
  },
  input: {
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#2E323B',
  },
  leftIcon: { position: 'absolute', left: 12, top: 12 },
  eyeBtn: { position: 'absolute', right: 12, top: 12 },

  reqTitle: { fontWeight: '800', fontSize: 16, color: '#596070', marginBottom: 10 },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 6 },
  reqText: { fontSize: 15 },

  button: {
    marginTop: 24, marginHorizontal: 16, borderRadius: 12, paddingVertical: 14, alignItems: 'center',
  },
  buttonEnabled: { backgroundColor: '#2563EB' },
  buttonDisabled: { backgroundColor: '#E6E9F0' },
  buttonText: { fontWeight: '800', letterSpacing: 1, color: '#fff' },
  buttonTextDisabled: { color: '#A9B0BF' },
});
