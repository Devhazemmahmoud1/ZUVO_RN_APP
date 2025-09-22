import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { EditIcon } from '../../../icons/EditICon';
import LocationIcon from '../../../icons/Location';
import TrashIcon from '../../../icons/Trash';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../../../components/Loading';
import { getCairoFont } from '../../../ultis/getFont';
import {
  useAddresses,
  useConfirmDefaultAddress,
  useDeleteAddress,
} from '../../../apis/addressApi';
import { t } from 'i18next';
import { useLanguage } from '../../../LanguageProvider';

const AddressView = ({
  navigation,
  addressVisible,
  setAddressVisible,
  openMap,
}: any) => {
  const [clicked, setClicked] = useState();
  const [defaultAddress, setDefaultAddress] = useState<any>(null);
  const { data: addresses, isLoading } = useAddresses();
  const { mutate: confirmAddress, isPending: isPending } =
    useConfirmDefaultAddress();
  const { mutate: deleteAddress, isPending: removing } = useDeleteAddress();

  const { isRTL } = useLanguage();

  const confirmAddresses = () => {
    if (defaultAddress === clicked) {
      return;
    }

    confirmAddress({
      defaultAddress: clicked,
    });
  };

  const handleDelete = (id: string) => {
    deleteAddress({
      id
    })
  };

  useEffect(() => {
    setDefaultAddress(addresses?.find((a) => a.isPrimary)?.id)
  }, [addresses])

  const handleEdit = (item: any) => {
    setAddressVisible(false);
    navigation.navigate('AddressDetails', {
      incomingData: item,
      address: item.address,
      navigation: navigation,
      location: {
        latitude: item.lat,
        longitude: item.lng,
      },
    });
  };

  return (
    <Modal
      isVisible={addressVisible}
      onBackdropPress={() => setAddressVisible(false)}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={{ margin: 0 }}
    >
      {(isLoading || isPending || removing) && <LoadingSpinner overlay />}
      <View style={styles.fullScreen}>
        <View style={styles.header}>
          <Text style={[getCairoFont('800'), { fontSize: 20, lineHeight: 25 }]}>
            {t('app')}
          </Text>
          <TouchableOpacity onPress={() => setAddressVisible(false)}>
            <Text style={styles.cancelText}>{ t('cancel')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Add your address view content here */}
          <TouchableOpacity
            style={styles.fullButton}
            onPress={() => openMap(true)}
          >
            <Text style={styles.addAddressButtonText}>{t('addNewAddress')}</Text>
          </TouchableOpacity>

          {addresses &&
            addresses?.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.box,
                  clicked === item.id
                    ? styles.defaultBox
                    : styles.notDefaultBox,
                ]}
                onPress={() => setClicked(item.id)} // add your press handler here
                activeOpacity={0.8}
              >
                {/* Section 1 */}
                <View style={styles.section1}>
                  <View style={styles.leftRow}>
                    <LocationIcon size={17} />
                    {item.isPrimary === true && (
                      <Text style={styles.defaultText}>{ t('default') }</Text>
                    )}
                  </View>
                  <View style={styles.rightContainer}>
                    <TouchableOpacity
                      style={styles.rightRow}
                      onPress={() => handleEdit(item)}
                    >
                      <EditIcon size={15} />
                      <Text style={styles.editText}>{t('edit')}</Text>
                    </TouchableOpacity>
                    {item.isPrimary !== true && (
                      <TouchableOpacity
                        style={styles.rightRow}
                        onPress={() => handleDelete(item.id)}
                      >
                        <TrashIcon size={15} />
                        <Text style={styles.editText}>{t('delete')}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Section 2 */}
                <View style={styles.section2}>
                  <View style={styles.infoRow}>
                    <Text style={[styles.label, isRTL ? getCairoFont('700') : undefined]}>{t('name')}:</Text>
                    <Text style={styles.value}>
                      {item.firstName} {item.lastName}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={[styles.label, isRTL ? getCairoFont('700') : undefined]}>{t('address')}:</Text>
                    <Text style={styles.value}>
                      {item.address}
                      {item.additionalAddress
                        ? `, ${item.additionalAddress}`
                        : ''}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={[styles.label, isRTL ? getCairoFont('700') : undefined]}>{t('mobile')}:</Text>
                    <Text style={styles.value}>
                      {item.mobile}
                      <Text style={{ color: 'green', fontWeight: 'bold' }}>
                        {'Verified'}
                      </Text>
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => confirmAddresses()}
          >
            <Text style={styles.footerButtonText}>{t('confirm')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50, // space for header
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  cancelText: {
    fontSize: 15,
    color: '#000',
    fontWeight: '400',
  },
  content: {
    // flex: 1,
    // height: '100%',
    padding: 20,
    // backgroundColor: '#F0F0FA',
    paddingBottom: 100,
  },
  fullButton: {
    width: 'auto',
    marginTop: 10,
    marginBottom: 16,
    borderWidth: 1.2,
    borderColor: 'tomato',
    padding: 10,
    borderRadius: 10,
  },
  addAddressButtonText: {
    letterSpacing: 0.3,
    color: 'tomato',
    textAlign: 'center',
    fontWeight: 600,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // optional spacing between buttons
  },
  box: {
    backgroundColor: '#F0F0FA',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#F0F0FA',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginTop: 10,
  },
  defaultBox: {
    borderWidth: 2,
    borderColor: 'tomato',
  },
  notDefaultBox: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  section1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
    borderRadius: 20,
    backgroundColor: 'tomato',
    paddingVertical: 2,
    paddingHorizontal: 8,
  },

  editText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#000',
    fontWeight: '300',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
  section2: {
    gap: 20,
    justifyContent: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'left',
    color: 'grey',
    width: 70,
  },
  value: {
    fontSize: 13,
    color: '#262525',
    flexShrink: 1, // prevents overflow
    flexWrap: 'wrap', // allows wrapping
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  footerButton: {
    backgroundColor: 'tomato',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  footerButtonText: {
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.5,
    fontSize: 13,
  },
  logo: {
    width: 40,
    height: 40,
  },
});

export default AddressView;
