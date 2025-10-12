import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, Switch, TouchableOpacity,
  SafeAreaView, ScrollView, Platform, Alert,

} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useStripe } from '@stripe/stripe-react-native';
import { apiRequest } from '../../ultis/api';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Visa from '../../icons/v';
import MasterCard from '../../icons/m';

const brandIcon = (brand?: string) => {
  switch ((brand || '').toLowerCase()) {
    case 'visa': return { name: 'visa', color: '#1D4ED8', size: 30 };
    case 'mastercard': return { name: 'mastercard', color: '#FF5F00', size: 28 };
    case 'amex': return { name: 'credit-card-outline', color: '#059669', size: 26 };
    default: return { name: 'credit-card-outline', color: '#6B7280', size: 26 };
  }
};

type StripeCard = {
  id: string;
  card?: {
    brand?: string;
    last4?: string;
    exp_month?: number;
    exp_year?: number;
  };
};

export default function PaymentMethodsScreen() {
  const navigation = useNavigation<any>();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<StripeCard[]>([]);
  const [defaultPmId, setDefaultPmId] = useState<string | null>(null);

  // state for "add card" sheet
  const [sheetReady, setSheetReady] = useState(false);
  const [initializingSheet, setInitializingSheet] = useState(false);

  const api = useMemo(() => ({
    // list saved cards + default from your backend
    loadPaymentMethods: () =>
      apiRequest<{ paymentMethods: StripeCard[]; defaultPaymentMethod: string | null }>({
        path: '/api/stripe/payment-methods',
        method: 'get',
      }),
    // create ephemeral key (Stripe requires Stripe-Version header)
    createEphemeralKey: () =>
      apiRequest<{ ephemeralKeySecret: string }>({
        path: '/api/stripe/ephemeral-key',
        method: 'post',
        headers: { 'Stripe-Version': '2025-08-27.basil' },
        body: {}, // backend infers customer from auth token
      }),
    // create SetupIntent for adding a new card
    createSetupIntent: () =>
      apiRequest<{ clientSecret: string }>({
        path: '/api/stripe/setup-intent',
        method: 'post',
        body: {}, // backend creates SI for the authed customer
      }),
    detachPaymentMethod: (paymentMethodId: string) =>
      apiRequest<{ success: boolean }>({
        path: '/api/stripe/detach',
        method: 'post',
        body: { paymentMethodId },
      }),
    setDefaultPaymentMethod: (paymentMethodId: string) =>
      apiRequest<{ success: boolean }>({
        path: '/api/stripe/set-default',
        method: 'post',
        body: { paymentMethodId },
      }),
  }), []);

  const loadCards = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.loadPaymentMethods();
      setCards(data?.paymentMethods || []);
      setDefaultPmId(data?.defaultPaymentMethod ?? null);
    } catch {
      Alert.alert('Error', 'Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  }, [api]);

  // Prepare PaymentSheet in SETUP mode (to add a card)
  const prepareAddCardSheet = useCallback(async () => {
    setInitializingSheet(true);
    try {
      // 1) ephemeral key (so sheet can attach PM to the customer)
      const ek = await api.createEphemeralKey();
      // 2) setup intent to save a new card
      const si = await api.createSetupIntent();

      // 3) init sheet (setup mode -> provide setupIntentClientSecret)
      const { error } = await initPaymentSheet({
        customerEphemeralKeySecret: ek.ephemeralKeySecret,
        setupIntentClientSecret: si.clientSecret,
        // strongly recommended for 3DS return:
        returnURL: 'zuvo://stripe-redirect',
        appearance: { shapes: { borderRadius: 10 } },
        // to allow cards that may require delayed capture/confirmation later:
        allowsDelayedPaymentMethods: true,
        merchantDisplayName: 'Zuvo',
      });

      setSheetReady(!error);
    } catch (e) {
      setSheetReady(false);
    } finally {
      setInitializingSheet(false);
    }
  }, [api, initPaymentSheet]);

  useEffect(() => {
    loadCards();
    prepareAddCardSheet();
  }, [loadCards, prepareAddCardSheet]);

  const addCard = useCallback(async () => {
    if (!sheetReady) return;
    const { error } = await presentPaymentSheet();
    if (error) {
      if (error.code !== 'Canceled') {
        Alert.alert('Stripe', error.message ?? 'Something went wrong');
      }
      // Re-init a fresh sheet next time (good hygiene)
      void prepareAddCardSheet();
      return;
    }
    // Card saved successfully — refresh list
    await loadCards();
    // Re-init a fresh sheet for next add
    void prepareAddCardSheet();
  }, [sheetReady, presentPaymentSheet, loadCards, prepareAddCardSheet]);

  const detach = useCallback(async (paymentMethodId: string) => {
    try {
      await api.detachPaymentMethod(paymentMethodId);
      await loadCards();
    } catch {
      Alert.alert('Error', 'Cannot delete this card.');
    }
  }, [api, loadCards]);

  const setDefault = useCallback(async (paymentMethodId: string) => {
    try {
      await api.setDefaultPaymentMethod(paymentMethodId);
      setDefaultPmId(paymentMethodId);
    } catch {
      Alert.alert('Error', 'Failed to set default card');
    }
  }, [api]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.brandTitle}>Payment methods</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={addCard}
          disabled={!sheetReady || initializingSheet}
        >
          <Ionicons name="add-circle-outline" size={20} color="#2563EB" />
          <Text style={styles.addBtnText}>
            {initializingSheet ? 'Preparing…' : 'Add a new card'}
          </Text>
        </TouchableOpacity>

        {loading ? (
          <View style={{ padding: 16 }}>
            <SkeletonPlaceholder borderRadius={10}>
              {/* Add new card button placeholder */}
              <SkeletonPlaceholder.Item height={44} borderRadius={10} marginBottom={12} />

              {/* Card placeholders */}
              {[1, 2, 3].map(i => (
                <SkeletonPlaceholder.Item key={i} marginBottom={12} padding={12} borderRadius={10}>
                  {/* Top row: title + brand icon */}
                  <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" alignItems="center">
                    <SkeletonPlaceholder.Item width={'60%'} height={16} />
                    <SkeletonPlaceholder.Item width={28} height={18} borderRadius={4} />
                  </SkeletonPlaceholder.Item>

                  {/* Expiry label/value */}
                  <SkeletonPlaceholder.Item marginTop={12}>
                    <SkeletonPlaceholder.Item width={60} height={12} />
                    <SkeletonPlaceholder.Item width={80} height={14} marginTop={6} />
                  </SkeletonPlaceholder.Item>

                  {/* Bottom row: delete + default/switch */}
                  <SkeletonPlaceholder.Item marginTop={14} flexDirection="row" justifyContent="space-between" alignItems="center">
                    <SkeletonPlaceholder.Item width={80} height={18} />
                    <SkeletonPlaceholder.Item width={90} height={22} borderRadius={999} />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
              ))}
            </SkeletonPlaceholder>
          </View>
        ) : cards.length === 0 ? (
          <Text style={{ color: '#6B7280', paddingHorizontal: 16, marginTop: 12 }}>
            You don’t have any saved cards yet.
          </Text>
        ) : (
          cards.map(pm => {

            console.log(pm)

            const brand = pm.card?.brand;
            const last4 = pm.card?.last4;
            const exp = pm.card?.exp_month && pm.card?.exp_year
              ? `${pm.card?.exp_month}/${String(pm.card?.exp_year).slice(-2)}`
              : '--/--';
            const isDefault = defaultPmId === pm.id;
            const icon = brandIcon(brand);

            return (
              <View key={pm.id} style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.title}>
                    {brand ? brand.toUpperCase() : 'CARD'} •••••••• <Text style={styles.bold}>{last4}</Text>
                  </Text>
                  {pm.card?.brand == 'visa' && <Visa width={50} height={50} />}
                  {pm.card?.brand == 'mastercard' && <MasterCard width={60} height={60} />}
                </View>

                <Text style={styles.expiryLabel}>Expiry</Text>
                <Text style={styles.expiryValue}>{exp}</Text>

                <View style={styles.divider} />

                <View style={styles.row}>
                  {/* Left side: either delete button or empty spacer to keep switch on right */}
                  <View style={{ flex: 1 }}>
                    {!isDefault && (
                      <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                        onPress={() =>
                          Alert.alert('Delete card', 'Are you sure you want to delete this card?', [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Delete', style: 'destructive', onPress: () => detach(pm.id) },
                          ])
                        }
                      >
                        <Ionicons name="trash-outline" size={18} color="#6B7280" />
                        <Text style={{ color: '#6B7280' }}>Delete</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Right side: default label + switch (always aligned right) */}
                  <View style={styles.defaultWrap}>
                    {isDefault && <Text style={styles.defaultLabel}>DEFAULT</Text>}
                    <View style={styles.switchSmall}>
                      <Switch
                        value={isDefault}
                        onValueChange={(v) => {
                          if (v && !isDefault) {
                            void setDefault(pm.id); // keep signature as void
                          }
                        }}
                        trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
                        thumbColor={Platform.select({ ios: undefined, android: '#FFFFFF' })}
                      />
                    </View>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E7EB',
  },
  backBtn: { padding: 4, marginRight: 8 },
  brandTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  content: { paddingTop: 6, paddingBottom: 24 },

  addBtn: {
    marginHorizontal: 16, marginTop: 12, marginBottom: 8,
    paddingVertical: 10, paddingHorizontal: 12,
    backgroundColor: '#EEF2FF', borderRadius: 10,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  addBtnText: { color: '#2563EB', fontWeight: '600' },

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16, padding: 12, borderRadius: 10,
    borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 16, color: '#111827' },
  bold: { fontWeight: '700' },
  expiryLabel: { marginTop: 10, color: '#6B7280', fontWeight: '600', fontSize: 12 },
  expiryValue: { marginTop: 2, color: '#374151', fontSize: 14 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 14 },
  defaultWrap: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  defaultLabel: { color: '#2563EB', fontWeight: '700', marginRight: 8, fontSize: 12 },
  switchSmall: { transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] },
});
