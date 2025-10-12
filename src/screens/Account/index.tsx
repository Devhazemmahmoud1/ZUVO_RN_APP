import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Pressable,
  I18nManager,
  Platform,
  StatusBar,
} from 'react-native';
import { useAuth } from '../../AuthContext';
import ModernButton from '../../components/Button';
import { CreditCardIcon } from '../../icons/CredtiCard';
import React, { useEffect } from 'react';
import { HeartIcon } from '../../icons/Heart';
import { ReturnIcon } from '../../icons/Return';
import ProfileIcon from '../../icons/Profile';
import RightArrow from '../../icons/RightArrow';
import EyeDottedIcon from '../../icons/EyeDotted';
import { WorldIcon } from '../../icons/World';
import { LanguageIcon } from '../../icons/LanguageIcon';
import { LockSquareRoundedIcon } from '../../icons/Security';
import { ShoppingCartIcon } from '../../icons/SHoppingCart';
import { BellIcon } from '../../icons/NotificationIcon';
import { PowerIcon } from '../../icons/PowerIcon';
import AddressView from '../Addresses/components/AddressView';
import MapsView from '../Addresses/components/MapView';
import LocationIcon from '../../icons/Location';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../LanguageProvider';
import { getCairoFont } from '../../ultis/getFont';

export const Account = ({ route, navigation }) => {
  const { user, logout }: any = useAuth();
  const [addressVisible, setAddressVisible] = React.useState(false);
  const [mapVisible, setMapVisible] = React.useState(false);
  const { addressOpen } = route.params || {};
  const { language, setLanguage, isRTL } = useLanguage();
  const { t } = useTranslation();

  const onPressAuth = () => {};

  const style = {
    borderRadius: 0,
  };

  const renderBox = (
    iconLeft: any,
    iconRight: string,
    title: string,
    subtitle: string,
    onPress: () => void = () => {},
  ) => (
    <Pressable onPress={onPress} style={styles.box}>
      {iconLeft}
      <Pressable onPress={onPress} style={styles.boxTextContainer}>
        <Text style={styles.boxTitle}>{title}</Text>
        <Text style={styles.boxSubtitle}>{subtitle}</Text>
      </Pressable>
    </Pressable>
  );

  const renderListItem = (
    iconLeft: any,
    hasAnotherText: any,
    title: string,
    iconRight: any,
    isLast: boolean = false,
    onPress: () => void = () => {},
  ) => {
    return isRTL ? (
      <Pressable
        onPress={onPress}
        style={[styles.listItem, isLast && styles.listItemLast]}
      >
        {iconRight}
        {hasAnotherText && (
          <Text style={[styles.secondLanguage, getCairoFont('600')]}>
            {isRTL ? 'English' : 'العربيه'}
          </Text>
        )}
        <Text style={styles.listItemText}>{title}</Text><Text>{iconLeft}</Text>
      </Pressable>
    ) : (
      <Pressable
        onPress={onPress}
        style={[styles.listItem, isLast && styles.listItemLast]}
      >
        <Text>{iconLeft}</Text>
        <Text style={styles.listItemText}>{title}</Text>
        {hasAnotherText && (
          <Text style={[styles.secondLanguage, getCairoFont('600')]}>
            {isRTL ? 'English' : 'العربيه'}
          </Text>
        )}
        {iconRight}
      </Pressable>
    );
  };

  const onCancelMap = () => {
    setMapVisible(false);
    setAddressVisible(true);
  };

  const onOpenDetails = () => {
    setMapVisible(false);
  };

  useEffect(() => {
    if (addressOpen == true) {
      setAddressVisible(true);
    }
  }, [addressOpen]);

  const getArrow = () => {
    return (
      <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
        <RightArrow size={20} color="gray" />
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'android' ? { marginTop: (StatusBar.currentHeight ?? 24) } : null]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.welcomeTextWrapper}>
          <Text style={styles.welcomeText}>
            {!user?.user
              ? t('guest')
              : `${t('welcome', {
                  name: `${user.user.firstName} ${user.user.lastName}`,
                })} `}
          </Text>
        </View>

        {!user?.user && (
          <View style={styles.button}>
            <ModernButton
              onPress={onPressAuth}
              title="LOGIN OR REGISTER"
              style={style}
              disabled={false}
            />
          </View>
        )}

        {user?.user && (
          <View style={styles.boxWrapper}>
            {renderBox(
              <View
                style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}
              >
                <CreditCardIcon
                  style={{
                    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                  }}
                  size={24}
                  color="tomato"
                />
              </View>,
              'chevron-forward',
              t('orders'),
              t('trackOrders'),
              () => navigation.navigate('Orders'),
            )}
            {renderBox(
              <ProfileIcon size={24} color="tomato" />,
              'chevron-forward',
              t('profile'),
              t('profileManage'),
              () => navigation.navigate('Profile'),
            )}
            {renderBox(
              <View
                style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}
              >
                <ReturnIcon size={24} color="tomato" />
              </View>,
              'chevron-forward',
              t('returns'),
              t('trackYourReturns'),
              () => navigation.navigate('Returns'),
            )}
            {renderBox(
              <HeartIcon size={24} color="tomato" />,
              'chevron-forward',
              t('wishlist'),
              t('wishListCount', { count: 20 }),
              () => navigation.navigate('WishList'),
            )}
          </View>
        )}

        <View style={styles.welcomeTextWrapper}>
          <Text style={styles.welcomeText}>{t('myAccount')}</Text>
        </View>

        {user?.user && (
          <View style={styles.listBox}>
            {renderListItem(
              <ProfileIcon size={20} color="tomato" />,
              false,
              t('profile'),
              getArrow(),
              false,
              () => navigation.navigate('Profile'),
            )}
            {renderListItem(
              <LocationIcon size={20} color="tomato" />,
              false,
              t('myAddresses'),
              getArrow(),
              false,
              () => setAddressVisible(true),
            )}
            {renderListItem(
              <ShoppingCartIcon size={20} color="tomato" />,
              false,
              t('myCart'),
              getArrow(),
              false,
              () => navigation.navigate('Cart'),
            )}
            {renderListItem(
              <CreditCardIcon size={20} color="tomato" />,
              false,
              t('paymentMethod'),
              getArrow(),
              false,
              () => navigation.navigate('PaymentMethods'),
            )}
            {renderListItem(
              <EyeDottedIcon size={20} color="tomato" />,
              false,
              t('recentlyViewed'),
              getArrow(),
              false,
              () => console.log('Pressed Profile'),
            )}
            {renderListItem(
              <LockSquareRoundedIcon size={20} color="tomato" />,
              false,
              t('secure'),

              getArrow(),
              false,
              () => navigation.navigate('Security'),
            )}

            {renderListItem(
              <LanguageIcon size={20} color="tomato" />,
              true,
              t('langs'),

              getArrow(),
              false,
              () => setLanguage(language === 'en' ? 'ar' : 'en'),
            )}
            {renderListItem(
              <BellIcon size={20} color="tomato" />,
              false,
              t('notifications'),
              getArrow(),
              false,
              () => console.log('Pressed Profile'),
            )}
            {renderListItem(
              <WorldIcon size={20} color="tomato" />,
              false,
              t('country'),
              getArrow(),
              false,
              () => console.log('Pressed Profile'),
            )}
            {renderListItem(
              <PowerIcon size={20} color="tomato" />,
              false,
              t('signout'),
              null,
              true,
              () => logout(),
            )}
          </View>
        )}

        {!user?.user && (
          <View style={styles.listBox}>
            {renderListItem(
              <ProfileIcon size={20} color="tomato" />,
              false,
              'Log in',
              <RightArrow size={20} color="gray" />,
              false,
              () => navigation.navigate('Authentication'),
            )}
            {renderListItem(
              <LanguageIcon size={20} color="tomato" />,
              true,
              'Languages',
              <RightArrow size={20} color="gray" />,
            )}
            {renderListItem(
              <WorldIcon size={20} color="tomato" />,
              false,
              'Country',
              <RightArrow size={20} color="gray" />,
              true,
            )}
          </View>
        )}

        {addressVisible && (
          <AddressView
            navigation={navigation}
            addressVisible={addressVisible}
            setAddressVisible={setAddressVisible}
            openMap={(bool: boolean) => {
              console.log(bool);
              setAddressVisible(false);
              setMapVisible(bool);
            }}
          />
        )}

        {mapVisible && (
          <MapsView
            setMapVisible={setMapVisible}
            mapVisible={mapVisible}
            onCancelMap={onCancelMap}
            navigation={navigation}
            onOpenDetails={onOpenDetails}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0FA',
  },
  secondLanguage: {
    marginRight: 5,
  },
  scrollContent: {
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  welcomeTextWrapper: {
    justifyContent: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
  },
  button: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  boxWrapper: {
    paddingLeft: 5,
    paddingRight: 5,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  box: {
    width: '49%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingTop: 20,
    paddingBottom: 20,
  },
  boxTextContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  boxTitle: {
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  boxSubtitle: {
    textAlign: 'left',
    fontSize: 12,
    color: '#666',
  },
  listBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    gap: 10,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  listItem: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  listItemText: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 14,
    color: '#333',
    textAlign: 'left',
  },
  listItemLast: {
    borderBottomWidth: 0,
  },
});

export default Account;
