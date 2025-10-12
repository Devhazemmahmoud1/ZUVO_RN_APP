import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
  Easing,
  FlatList,
  ImageSourcePropType,
  Image,
  // PanResponder,
  // LayoutChangeEvent,
  Pressable,
  StatusBar,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getCairoFont } from '../../ultis/getFont';
import DirhamLogo from '../../icons/Dirham';
import { useAddressContext } from '../../AddressProvider';
import AddressSwitcher from '../Home/component/AddressesSwitcher';
import { t } from 'i18next';
import { useLanguage } from '../../LanguageProvider';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useAddReceiver, useGetReceivers } from '../../apis/checkoutApi';
import LoadingSpinner from '../../components/Loading';
import ReceiverModal from './components/AddReceiver';
import { useCart } from '../../apis/cartApis';
import DragToConfirmFixed from './components/DragToConfirm';
import { useMakeOrder } from '../../apis/orderApi';
import { apiRequest } from '../../ultis/api';
import { useStripe } from '@stripe/stripe-react-native';

const { width: W } = Dimensions.get('window');

type StripeCard = {
  id: string;
  card?: {
    brand?: string;
    last4?: string;
    exp_month?: number;
    exp_year?: number;
  };
};

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

const CONTENT_W = W - 24 - 24;

const SHIP_CARD_W = Math.min(CONTENT_W * 0.85, 200);

const getReceiverId = (r: any) =>
  String(r?.id ?? r?._id ?? r?.receiverId ?? '');

export default function Checkout() {
  //   const [cvv, setCvv] = useState('');
  const isFocused = useIsFocused();
  const [openReceiver, setOpenReceiver] = useState(false);
  // store receiver id as string to handle numeric or Mongo _id seamlessly
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedReceiver, setSelectedReceiver] = useState<string | null>(null);
  const [leaveAtDoor, setLeaveAtDoor] = useState(false);
  const { effectiveAddress } = useAddressContext();
  const nav: any = useNavigation();
  const [openAddressSwitcher, setOpenAddressSwitcher] = useState<any>(false);
  const { isRTL } = useLanguage();
  const cancelModel = () => setOpenAddressSwitcher(false);
  const { data: cart, isPending: fetchingCart } = useCart();
  const { data: receivers, isPending: fetching } = useGetReceivers();
  const { mutateAsync: addReceiver, isPending: Adding } = useAddReceiver();
  const { mutateAsync: createOrder, isPending: creating } = useMakeOrder();
  const [selectedDate, setSelectedDate] = useState('tomorrow');
  const [selectedMethod, setSelectedMethod] = useState('cod');
  const [cards, setCards] = useState<StripeCard[]>([]);
  const [defaultPmId, setDefaultPmId] = useState<string | null>(null);
  const subtotal = cart.items.reduce((acc, item) => acc + item.lineTotal, 0);
  const shipping = 0;
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);
  const { handleNextAction } = useStripe();
  const [paying, setPaying] = useState(false);

  // money formatting helpers (locale-aware, 2 decimals)
  const fmt = (n: number) =>
    n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const to2 = (n: number) => Math.round(n * 100) / 100;

  const pinY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pinY, {
          toValue: -2,
          duration: 300,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pinY, {
          toValue: 0,
          duration: 500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [pinY]);

  const handleCloseModel = () => setOpenReceiver(false);

  const handleAddReceiver = async ({ name, phone }) => {
    try {
      const res: any = await addReceiver({ name, phone });
      // Best effort: try to preselect the newly added receiver
      const added = Array.isArray(res)
        ? res[res.length - 1]
        : Array.isArray(res?.data)
        ? res.data[res.data.length - 1]
        : res;
      const rid = getReceiverId(added);
      if (rid) setSelectedReceiver(rid);
    } catch (e) {
      // no-op; modal already closed by child
    }
  };

  const handleCheckOut = async () => {

      if (selectedMethod === 'card') {
    const result = await payWithCard();
    if (!result.ok) return;
    console.log('Payment success:', result.status ?? 'succeeded');
  } else if (selectedMethod === 'apple') {
    Alert.alert('Not implemented', 'Apple Pay will be added later.');
    return;
  }


    createOrder(
      {
        deliveryAddress: effectiveAddress,
        leaveAtDoor: leaveAtDoor,
        deliveryDay: selectedDate,
        receiver: selectedReceiver,
        paymentMethod: selectedMethod,
      },
      {
        onSuccess: data => {
          console.log(data);
          nav.navigate('OrderPlaced', {
            addressLabel: 'Home',
            address: data.shippingInfo.address.address,
            shipmentNumber: 1,
            estimatedLabel: 'Estimated delivery',
            arrivingWhen: data.shippingInfo.deliveryDate.toUpperCase(),
            productImage: data.items[0].imageUrl, // placeholder square image
          });
        },
        onError: err => {
          console.log('Order error', err);
          Alert.alert('Order failed', 'Please try again.');
        },
      },
    );
  };

  const api = useMemo(
    () => ({
      // list saved cards + default from your backend
      loadPaymentMethods: () =>
        apiRequest<{
          paymentMethods: StripeCard[];
          defaultPaymentMethod: string | null;
        }>({
          path: '/api/stripe/payment-methods',
          method: 'get',
        }),
      createPaymentIntent: (p: {
        amountMinor: number;
        paymentMethodId: string;
      }) =>
        apiRequest<{ clientSecret: string; status: string }>({
          path: '/api/stripe/payment-intent',
          method: 'post',
          body: {
            amount: p.amountMinor,
            paymentMethodId: p.paymentMethodId,
          },
        }),
    }),

    [],
  );

  const loadCards = useCallback(async () => {
    try {
      const data = await api.loadPaymentMethods();
      setCards(data?.paymentMethods || []);
      setDefaultPmId(data?.defaultPaymentMethod ?? null);
    } catch {
      Alert.alert('Error', 'Failed to load payment methods');
    }
  }, [api]);

  useEffect(() => {
    if (isFocused) loadCards();
  }, [loadCards, isFocused]);

  useEffect(() => {
    if (defaultPmId) {
      setSelectedMethod('card');
      setSelectedCardId(defaultPmId);
    }
  }, [defaultPmId]);

  const payWithCard = useCallback(async () => {
  if (!selectedCardId) {
    Alert.alert('Payment', 'Please select a card first.');
    return { ok: false as const };
  }

  try {
    setPaying(true);

    const amountMinor = Math.round(
      (selectedDate === 'today' ? Number(total) + 30 : total) * 100
    );

    // 1) Create & confirm the PI on the backend using the saved card
    const { clientSecret, status: initialStatus } = await api.createPaymentIntent({
      amountMinor,
      paymentMethodId: selectedCardId,
    });

    // If server said "succeeded" or "processing", we’re done.
    if (initialStatus === 'succeeded' || initialStatus === 'processing') {
      console.log('PI initial status:', initialStatus);
      return { ok: true as const, status: initialStatus };
    }

    // 2) If Stripe requires customer action (3DS), complete it on-device
    if (initialStatus === 'requires_action' && clientSecret) {
      const { paymentIntent, error } = await handleNextAction(clientSecret);
      if (error) {
        console.log('3DS / next-action error:', error);
        console.log('error.message');
        Alert.alert('Payment failed', 'Authentication failed.');
        return { ok: false as const, error };
      }
      const finalStatus = paymentIntent?.status?.toLowerCase();
      const ok = finalStatus === 'succeeded' || finalStatus === 'processing';
      console.log('PI final status:', finalStatus);
      if (!ok) {
        console.log(paymentIntent?.status)
        Alert.alert('Payment not completed');
      }
      return { ok, status: paymentIntent?.status };
    }

    // Any other status: treat as failure and surface info
    console.log('Unexpected PI status:', initialStatus);
    Alert.alert('Payment error', `Status: ${initialStatus}`);
    return { ok: false as const, status: initialStatus };
  } catch (e: any) {
    console.log('payWithCard exception:', e?.message || e);
    Alert.alert('Payment error', e?.message ?? 'Unexpected error.');
    return { ok: false as const, error: e };
  } finally {
    setPaying(false);
  }
}, [api, handleNextAction, selectedCardId, selectedDate, total]);

  return (
    <SafeAreaView
      style={[
        s.screen,
        Platform.OS === 'android'
          ? { marginTop: StatusBar.currentHeight ?? 24 }
          : null,
      ]}
    >
      {/* Header */}
      {
        /* fetching */ (false ||
          /* Adding */ false ||
          fetchingCart ||
          creating ||
          paying) && <LoadingSpinner overlay />
      }
      <View
        style={[
          s.headerRow,
          Platform.OS === 'android' ? { paddingTop: 18 } : null,
        ]}
      >
        <TouchableOpacity
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => nav.goBack()}
        >
          <Ionicons
            name="arrow-back"
            style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
            size={22}
            color={COLORS.text}
          />
        </TouchableOpacity>
        <Text style={[s.headerTitle, getCairoFont('700')]}>
          {t('checkout')}
        </Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 160 }}
          showsVerticalScrollIndicator={false}
        >
          {/* ===== Address ===== */}
          <Card title={t('deliveryAddress')}>
            <TouchableOpacity style={s.addrBtnFull} activeOpacity={0.9}>
              <Animated.View
                style={[s.addrIcon, { transform: [{ translateY: pinY }] }]}
              >
                <Ionicons name="location-sharp" size={20} color="tomato" />
              </Animated.View>

              <Pressable
                style={s.addressContainer}
                onPress={() => setOpenAddressSwitcher(true)}
              >
                <Text
                  numberOfLines={1}
                  style={[s.addrText, getCairoFont('600')]}
                >
                  {effectiveAddress?.address}
                </Text>
              </Pressable>
              {/* <Ionicons name="chevron-forward" size={18} color={COLORS.sub} /> */}
            </TouchableOpacity>
          </Card>

          {/* ===== Delivery Instructions ===== */}
          <Card title={t('deliveryInstructions')}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setLeaveAtDoor(v => !v)}
              style={[s.toggleCard, leaveAtDoor && s.toggleCardSel]}
            >
              <Ionicons name="home-outline" size={18} color={COLORS.text} />
              <Text style={[s.toggleTxt, getCairoFont('700')]}>
                {t('leaveAtMyDoor')}
              </Text>
            </TouchableOpacity>
          </Card>
          <Card
            title={t('whoWillReceive')}
            //   right={<Badge text="NEW" />}
            tint
          >
            <View style={s.recipientRow}>
              {receivers !== undefined &&
                Array.isArray(receivers) &&
                receivers.map((res: any) => {
                  const id = getReceiverId(res);
                  return (
                    <SelectableChip
                      key={id || res?.name}
                      selected={selectedReceiver === id}
                      onPress={() =>
                        setSelectedReceiver(selectedReceiver === id ? null : id)
                      }
                      text={res.name}
                      sub={res.phone}
                      style={s.half}
                    />
                  );
                })}
              <SelectableChip
                onPress={() => setOpenReceiver(true)}
                text={t('someoneElse')}
                icon="call-outline"
                style={s.half}
              />
            </View>
          </Card>

          {/* ===== Shipment summary ===== */}
          <Card
            title={
              <Text style={getCairoFont('600')}>
                {t('shipment')}{' '}
                <Text style={s.muted}>
                  {' '}
                  (
                  {t('itemsCount', {
                    count: cart.items.length ?? 1,
                  })}
                  )
                </Text>
              </Text>
            }
            // right={<Tag text="express" />}
          >
            {/* Horizontal product list */}
            <FlatList
              data={cart.items ?? []}
              keyExtractor={it => it.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.shipList}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              decelerationRate="fast"
              renderItem={({ item }) => (
                <View style={s.shipItem}>
                  <Thumb img={item.image} light={item.light} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={s.brand}>{item.brand}</Text>
                    <Text
                      numberOfLines={1}
                      style={[s.titleSm, getCairoFont('700')]}
                    >
                      {isRTL ? item.name_ar : item.name_en}
                    </Text>
                    <Text style={[s.price, getCairoFont('800')]}>
                      <DirhamLogo size={12} /> {fmt(to2(item.lineTotal))}
                    </Text>
                  </View>
                </View>
              )}
            />

            <View style={{ height: 8 }} />
            <Row gap={8}>
              <Ionicons name="calendar" size={16} color={COLORS.green} />
              <Text style={s.meta}>
                {t('getIt')}{' '}
                <Text style={{ color: COLORS.green, fontWeight: '600' }}>
                  {t('tom')}
                </Text>
              </Text>
            </Row>
          </Card>

          {/* ===== Delivery speed (radio) ===== */}
          <Card>
            {/* Free delivery by Today promo border substitute */}
            <PromoOutline>
              <Row
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={[s.greenStrong, getCairoFont('600')]}>
                  {t('getItToday')}
                </Text>
              </Row>
            </PromoOutline>

            <View style={{ height: 12 }} />

            <RadioRow
              selected={selectedDate == 'today'}
              onPress={() => setSelectedDate('today')}
              label={t('getItToday')}
              note="+  Đ 30.00"
            />
            <RadioRow
              selected={selectedDate == 'tomorrow'}
              onPress={() => setSelectedDate('tomorrow')}
              label={t('getItTomorrow')}
              note={t('free')}
              noteGreen
            />
          </Card>

          {/* ===== Pay With ===== */}
          <Card title="Pay With">
            {/* <Chip icon="logo-apple" label="Apple Pay" /> */}

            {/* Card method box */}

            {/* noon One CC */}
            {/* <TouchableOpacity activeOpacity={0.9} style={s.noonOne}>
              <Row
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Row gap={10} style={{ alignItems: 'center' }}>
                  <Image
                    source={require('../../assets/main_logo.png')}
                    style={{ width: 26, height: 18, borderRadius: 4 }}
                  />
                  <Text style={[s.payTitle, getCairoFont('800')]}>
                    noon One Credit Card
                  </Text>
                </Row>
                <Text style={s.linkBlue}>Apply Now</Text>
              </Row>
              <Text style={[s.cashback, getCairoFont('700')]}>
                Extra <DirhamLogo size={12} /> 192.58 cashback
              </Text>
            </TouchableOpacity> */}

            {/* BNPL + COD */}
            {/* <MethodRow
              logo="bag-handle-outline"
              name="Tamara"
              desc="Pay 4 interest free payments of 962.88"
            />
            <MethodRow
              logo="card-outline"
              name="Tabby"
              desc="Pay 4 interest free payments of Đ 962.88"
            /> */}
            <MethodRow
              selected={selectedMethod === 'apple'}
              onPress={() => {
                setSelectedMethod('apple');
                setSelectedCardId(null);
              }}
              logo="logo-apple"
              name={'Apple Pay'}
              desc={''}
            />
            <TouchableOpacity
              activeOpacity={0.9}
              style={s.payCardSel}
              onPress={() => nav.navigate('PaymentMethods')}
            >
              <Row
                gap={10}
                style={{ alignItems: 'center' }}
                onPress={() => nav.navigate('PaymentMethods')}
              >
                <TinyBadge text="Debit/Credit Card" />
                <View>
                  <Text style={[s.payTitle, getCairoFont('800')]}>
                    Add Card
                  </Text>
                </View>
              </Row>
            </TouchableOpacity>

            {cards &&
              cards?.map(card => (
                <MethodRow
                  selected={
                    selectedMethod === 'card' && selectedCardId === card.id
                  }
                  onPress={() => {
                    setSelectedMethod('card');
                    setSelectedCardId(card.id);
                  }}
                  logo="card-outline"
                  name={`•••••••• ${card.card?.last4}`}
                  desc={''}
                />
              ))}

            <MethodRow
              selected={selectedMethod === 'cod'}
              onPress={() => {
                setSelectedMethod('cod');
                setSelectedCardId(null);
              }}
              logo="cash-outline"
              name={t('cod')}
              desc={t('extraCharges')}
            />
          </Card>

          {/* ===== Order Summary ===== */}
          <Card title={t('orderSummary')}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Text style={s.subtle}>
                {t('subTotal')}{' '}
                <Text style={s.muted}>
                  ({t('itemsCount', { count: cart.items.length })})
                </Text>
              </Text>
              <Text style={s.bold}>
                <DirhamLogo size={12} /> {fmt(to2(subtotal))}
              </Text>
            </Row>
            <Row style={{ justifyContent: 'space-between', marginTop: 10 }}>
              <Text style={s.subtle}>{t('shipFee')} </Text>
              <Text style={[s.bold, { color: COLORS.green }]}>{t('free')}</Text>
            </Row>

            <View style={s.hr} />

            <Row style={{ justifyContent: 'space-between' }}>
              <Text style={[s.totalLabel, getCairoFont('800')]}>
                {t('total')} <Text style={s.muted}>({t('incVat')})</Text>
              </Text>
              <Text style={[s.totalVal, getCairoFont('900')]}>
                <DirhamLogo size={13} />{' '}
                {fmt(to2(selectedDate == 'today' ? Number(total) + 30 : total))}
              </Text>
            </Row>

            {/* <View style={s.noonSave}>
              <Row
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={[getCairoFont('800')]}>
                  noon One Credit Card Cashback
                </Text>
                <Row gap={6} style={{ alignItems: 'center' }}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={14}
                    color={COLORS.sub}
                  />
                  <Text style={[s.bold, { color: COLORS.text }]}>
                    <DirhamLogo size={12} /> 192.58
                  </Text>
                </Row>
              </Row>
              <Text style={s.muted}>
                Unlock with noon One Credit Card.{' '}
                <Text style={s.linkBlue}>Apply Now.</Text>
              </Text>
            </View> */}
          </Card>
        </ScrollView>

        {/* Floating green banner (above sticky bar) */}
        {/* <View pointerEvents="none" style={s.floatSave}>
          <Row
            style={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Text style={[s.saveText, getCairoFont('800')]}>
              Save <DirhamLogo size={12} /> 192.58 on this order!
            </Text>
            <Image
              source={require('../../assets/main_logo.png')}
              style={{ width: 46, height: 28, borderRadius: 6 }}
            />
          </Row>
        </View> */}

        {/* Sticky CVV bar + totals row */}
        <View style={s.sticky}>
          <View style={s.sliderContainer}>
            <DragToConfirmFixed
              key={`${selectedReceiver}|${leaveAtDoor}|${selectedDate}|${selectedMethod}`}
              label={t('slideToOrder')}
              travelPx={Math.min(Dimensions.get('window').width * 0.88, 360)} // responsive width
              requireFullEnd
              direction={isRTL ? 'rtl' : 'ltr'} // <— key line
              onComplete={() => {
                handleCheckOut();
              }}
            />

            <Row style={s.footerTotals}>
              <Text style={[s.muted, getCairoFont('700')]}>
                {t('itemsCount', {
                  count: cart.items.length,
                })}
              </Text>
              <Text style={[s.footerTotal, getCairoFont('900')]}>
                <DirhamLogo size={12} />{' '}
                {fmt(to2(selectedDate == 'today' ? Number(total) + 30 : total))}
              </Text>
            </Row>
          </View>
        </View>
      </View>
      <AddressSwitcher
        openAddressSwitcher={openAddressSwitcher}
        cancel={cancelModel}
      />

      <ReceiverModal
        visible={openReceiver}
        onClose={handleCloseModel}
        onAdd={handleAddReceiver}
      />
    </SafeAreaView>
  );
}

/* ---------- Little building blocks ---------- */
function Card({
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
          {typeof title === 'string' ? (
            <Text style={[s.cardTitle, getCairoFont('700')]}>{title}</Text>
          ) : (
            title
          )}
          {right ?? null}
        </Row>
      )}
      {info ? (
        <Ionicons
          name="information-circle-outline"
          size={16}
          color={COLORS.sub}
        />
      ) : null}
      {children}
    </View>
  );
}

function Row({
  children,
  gap = 6,
  style,
  onPress,
}: {
  children: React.ReactNode;
  gap?: number;
  style?: any;
  onPress?: any;
}) {
  return (
    <Pressable onPress={onPress} style={[{ flexDirection: 'row' }, style]}>
      {React.Children.map(children, (c, i) => (
        <View
          style={{
            marginRight: i === React.Children.count(children) - 1 ? 0 : gap,
          }}
        >
          {c}
        </View>
      ))}
    </Pressable>
  );
}

// function Pill({ icon, label }: { icon: string; label: string }) {
//   return (
//     <View style={s.pill}>
//       <Ionicons name={icon} size={16} color={COLORS.text} />
//       <Text style={s.pillTxt}>{label}</Text>
//     </View>
//   );
// }

// function CheckBox() {
//   return (
//     <View style={s.checkbox}>
//       {/* unchecked for demo */}
//     </View>
//   );
// }

// function Badge({ text }: { text: string }) {
//   return (
//     <View style={s.badge}>
//       <Text style={[s.badgeTxt, getCairoFont('800')]}>{text}</Text>
//     </View>
//   );
// }

// function Tag({ text }: { text: string }) {
//   return (
//     <View style={s.tag}>
//       <Text style={[s.tagTxt, getCairoFont('900')]}>{text}</Text>
//     </View>
//   );
// }

function Thumb({ img, light }: { img?: ImageSourcePropType; light?: boolean }) {
  return (
    <View
      style={[
        s.thumb,
        { backgroundColor: light ? '#F1F5F9' : '#EBEEF5', overflow: 'hidden' },
      ]}
    >
      {img ? (
        <Image
          source={{ uri: img as any }}
          style={s.thumbImg}
          resizeMode="contain"
        />
      ) : null}
    </View>
  );
}

function SelectableChip({
  selected,
  text,
  sub,
  icon,
  style,
  onPress,
}: {
  selected?: boolean;
  text: string;
  sub?: string;
  icon?: string;
  style?: any;
  onPress?: any;
}) {
  return (
    <Pressable
      style={[s.selChip, selected && s.selChipSel, style]}
      onPress={onPress}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
          minWidth: 0,
        }}
      >
        {icon ? <Ionicons name={icon} size={16} color={COLORS.text} /> : null}
        <View style={{ marginLeft: 8, flexShrink: 1, minWidth: 0 }}>
          <Text numberOfLines={1} style={[s.selTxt, getCairoFont('800')]}>
            {text}
          </Text>
          {sub ? (
            <Text numberOfLines={1} style={s.muted}>
              {sub}
            </Text>
          ) : null}
        </View>
      </View>
      {selected ? (
        <Ionicons name="checkmark-circle" size={18} color={COLORS.blue} />
      ) : null}
    </Pressable>
  );
}

function PromoOutline({ children }: { children: React.ReactNode }) {
  return <View style={s.promoOutline}>{children}</View>;
}

function Chip({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={s.chip}>
      <Ionicons name={icon} size={16} color={COLORS.text} />
      <Text style={[s.chipTxt, getCairoFont('800')]}>{label}</Text>
    </View>
  );
}

function TinyBadge({ text }: { text: string }) {
  return (
    <View style={s.tinyBadge}>
      <Text style={[s.tinyBadgeTxt, getCairoFont('900')]}>{text}</Text>
    </View>
  );
}

function MethodRow({
  logo,
  name,
  desc,
  onPress,
  selected,
}: {
  logo: string;
  name: string;
  desc: string;
  onPress?: any;
  selected?: boolean;
}) {
  return (
    <Pressable
      style={[s.methodRow, selected ? s.methodRowActive : undefined]}
      onPress={onPress}
    >
      <Row gap={10} style={{ alignItems: 'center' }} onPress={onPress}>
        <View style={s.logoBox}>
          <Ionicons name={logo} size={16} color={COLORS.text} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.payTitle, getCairoFont('800')]}>{name}</Text>
          {desc != '' && <Text style={s.muted}>{desc}</Text>}
        </View>
      </Row>
    </Pressable>
  );
}

function RadioRow({
  selected,
  label,
  note,
  noteGreen,
  onPress,
}: {
  selected?: boolean;
  label: string;
  note?: string;
  noteGreen?: boolean;
  onPress?: any;
}) {
  return (
    <Row
      style={{
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
      }}
      onPress={onPress}
    >
      <Row gap={8} style={{ alignItems: 'center' }} onPress={onPress}>
        <Ionicons
          name={selected ? 'radio-button-on' : 'radio-button-off'}
          size={18}
          color={selected ? COLORS.blue : COLORS.sub}
        />
        <Text
          style={[
            s.payTitle,
            getCairoFont('800'),
            selected && { color: COLORS.green },
          ]}
        >
          {label}
        </Text>
      </Row>
      {note ? (
        <Text
          style={[s.bold, { color: noteGreen ? COLORS.green : COLORS.text }]}
        >
          {note}
        </Text>
      ) : null}
    </Row>
  );
}

// function clamp(n: number, min: number, max: number) {
//   'worklet';
//   return Math.max(min, Math.min(n, max));
// }

// export function SlideToPay({
//   label = 'Slide To Order',
//   onComplete,
//   disabled = false,
//   style,
// }: {
//   label?: string;
//   onComplete?: () => void;
//   disabled?: boolean;
//   style?: any;
// }) {
//   const HANDLE = 40;
//   const TRACK_H = 56;
//   const PADDING = 8;

//   const [trackW, setTrackW] = useState(0);
//   const maxX = Math.max(0, trackW - HANDLE - PADDING * 2);

//   const x = useRef(new Animated.Value(0)).current;
//   const startX = useRef(0); // <-- remember where we were when the drag starts

//   const pan = useRef(
//     PanResponder.create({
//       // Grab the gesture early and prefer horizontal motion.
//       onStartShouldSetPanResponder: () => !disabled,
//       onStartShouldSetPanResponderCapture: () => !disabled,
//       onMoveShouldSetPanResponder: (_e, g) =>
//         !disabled && (Math.abs(g.dx) > 3 || Math.abs(g.dx) > Math.abs(g.dy)),
//       onMoveShouldSetPanResponderCapture: (_e, g) =>
//         !disabled && Math.abs(g.dx) > Math.abs(g.dy),

//       onPanResponderGrant: () => {
//         // lock the current position as the gesture baseline
//         x.stopAnimation(v => {
//           startX.current = v;
//         });
//       },

//       onPanResponderMove: (_e, g) => {
//         const nx = clamp(startX.current + g.dx, 0, maxX);
//         x.setValue(nx);
//       },

//       onPanResponderRelease: () => {
//         x.stopAnimation((val: number) => {
//           if (val >= maxX * 0.9) {
//             Animated.timing(x, {
//               toValue: maxX,
//               duration: 120,
//               useNativeDriver: false,
//             }).start(() => onComplete?.());
//           } else {
//             Animated.spring(x, {
//               toValue: 0,
//               bounciness: 6,
//               useNativeDriver: false,
//             }).start();
//           }
//         });
//       },
//       onPanResponderTerminationRequest: () => false,
//     }),
//   ).current;

//   const onLayoutTrack = (e: LayoutChangeEvent) =>
//     setTrackW(e.nativeEvent.layout.width);

//   return (
//     <View
//       style={[s.track, { height: TRACK_H }, style]}
//       onLayout={onLayoutTrack}
//       collapsable={false} // make sure onLayout always fires
//     >
//       {/* Center label; never blocks touches */}
//       <Text pointerEvents="none" style={s.label}>
//         {label}
//       </Text>

//       {/* Draggable handle */}
//       <Animated.View
//         {...pan.panHandlers}
//         style={[
//           s.handle,
//           {
//             left: PADDING,
//             top: (TRACK_H - HANDLE) / 2,
//             transform: [{ translateX: x }],
//           },
//         ]}
//       >
//         <Ionicons name="arrow-forward" size={20} color="tomato" />
//       </Animated.View>
//     </View>
//   );
// }

/* ---------- Styles ---------- */
const s = StyleSheet.create({
  sliderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10, // spacing above totals
  },
  screen: { flex: 1, backgroundColor: COLORS.bg },
  addressContainer: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: Platform.select({ ios: 2, android: 8 }),
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    color: COLORS.text,
  },

  card: {
    marginHorizontal: 12,
    marginTop: 12,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  cardTint: { backgroundColor: '#FFF9FB' },
  cardTitle: { fontSize: 16, color: COLORS.text },
  linkBlue: { color: COLORS.blue, fontWeight: '800' },
  muted: { color: COLORS.sub },
  bold: { fontWeight: '800', color: COLORS.text },

  pin: {
    width: 30,
    height: 30,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addrBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: COLORS.soft,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  addrLine: { color: COLORS.sub, marginRight: 6 },
  addrText: { color: COLORS.text, width: '80%' },

  optionPillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  pillTxt: { marginLeft: 8, color: COLORS.text },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.line,
    backgroundColor: '#fff',
  },

  badge: {
    backgroundColor: '#FFEEF1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeTxt: { color: COLORS.danger, fontSize: 11 },

  selChip: {
    width: '100%', // fill the half column
    minWidth: 0, // allow truncation
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selChipSel: { borderColor: COLORS.blue },
  selTxt: { color: COLORS.text },

  tag: {
    backgroundColor: COLORS.yellow,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagTxt: { color: '#111827', fontSize: 11, fontWeight: '900' },

  thumb: { width: 60, height: 60, borderRadius: 10 },

  brand: { color: COLORS.sub, fontWeight: '700', textAlign: 'left' },
  titleSm: { color: COLORS.text, textAlign: 'left' },
  meta: { color: COLORS.text },

  greenStrong: { color: COLORS.green },
  promoOutline: {
    borderWidth: 1.5,
    borderColor: '#E2F4DA',
    backgroundColor: '#F5FFE8',
    padding: 10,
    borderRadius: 12,
  },
  joinOne: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#fff',
  },
  joinTxt: { color: COLORS.text, fontSize: 12 },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  chipTxt: { color: COLORS.text },

  payCardSel: {
    borderWidth: 2,
    borderColor: '#CFE2FF',
    borderRadius: 12,
    backgroundColor: '#F7FAFF',
    padding: 10,
    marginTop: 10,
  },
  tinyBadge: {
    backgroundColor: '#EEF2FF',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tinyBadgeTxt: { color: COLORS.blue, fontSize: 10 },
  payTitle: { color: COLORS.text, textAlign: 'left' },
  cardInner: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  visa: { color: COLORS.text },
  cvvBox: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: COLORS.soft,
  },
  cvvText: { color: COLORS.sub, fontWeight: '800' },

  noonOne: {
    backgroundColor: '#F0FFE6',
    borderRadius: 12,
    padding: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E2F4DA',
  },
  cashback: { color: COLORS.green, marginTop: 4 },

  methodRow: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  methodRowActive: {
    borderWidth: 2,
    borderColor: 'tomato',
  },
  logoBox: {
    width: 28,
    height: 22,
    borderRadius: 6,
    backgroundColor: COLORS.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  subtle: { color: COLORS.text },
  hr: { height: 1, backgroundColor: COLORS.line, marginVertical: 12 },
  totalLabel: { fontSize: 18, color: COLORS.text },
  totalVal: { fontSize: 18, color: COLORS.text },

  noonSave: {
    marginTop: 12,
    backgroundColor: '#F1FFE7',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2F4DA',
  },

  price: { color: COLORS.text, textAlign: 'left' },

  /* Floating save banner */
  floatSave: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 88,
    backgroundColor: '#DFF8BF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  saveText: { color: COLORS.text },

  /* Sticky CVV bar + footer totals */
  //   sticky: {
  //     position: 'absolute',
  //     left: 0,
  //     right: 0,
  //     bottom: 0,
  //     backgroundColor: '#fff',
  //     paddingBottom: Platform.select({ ios: 10, android: 6 }),
  //   },
  cvvBar: {
    marginHorizontal: 12,
    backgroundColor: '#E9EBF1',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  cvvArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  input: { flex: 1, textAlign: 'center', color: COLORS.text, letterSpacing: 2 },
  footerTotal: { color: COLORS.text, fontSize: 16 },
  addrBtnFull: {
    alignSelf: 'stretch', // fill the Card width
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.soft,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 10,
  },
  addrIcon: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Toggle card (Delivery instructions) */
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  toggleCardSel: {
    borderColor: COLORS.blue,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  toggleTxt: { color: COLORS.text },
  recipientRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 10, // <-- horizontal gap between the two chips
    rowGap: 5,
    // create even horizontal gutters without relying on `gap`
    marginHorizontal: -6, // gutter hack
  },

  half: {
    width: '48%', // exactly two per row
    paddingHorizontal: 6, // matches the negative margins above
    marginBottom: 12,
  },
  shipList: {
    paddingVertical: 4,
    // optional: give a little left/right breathing room
    paddingRight: 2,
  },

  shipItem: {
    width: SHIP_CARD_W,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  thumbImg: { width: '100%', height: '100%' },
  track: {
    borderRadius: 16,
    backgroundColor: 'tomato',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  label: {
    alignSelf: 'center',
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 1,
  },
  handle: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sticky: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingBottom: Platform.select({ ios: 10, android: 6 }),
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    zIndex: 1050,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },

  slider: {
    marginHorizontal: 12,
    marginTop: 6, // "margin top inside the footer"
  },

  footerTotals: {
    marginTop: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
