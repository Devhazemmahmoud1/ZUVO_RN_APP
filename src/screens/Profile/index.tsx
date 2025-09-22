import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { EditIcon } from '../../icons/EditICon';
import { useAuth } from '../../AuthContext';
import ModernButton from '../../components/Button';
import { handleEditProfile } from '../../apis/handleEditProfileInformation';
import LoadingSpinner from '../../components/Loading';
import OTPModal from '../../components/OTPModel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t } from 'i18next';
import { getCairoFont } from '../../ultis/getFont';

const buttonStyle = {
  borderRadius: 8,
  marginTop: 20,
  backgroundColor: 'tomato',
};

const disabledButtonStyle = {
    borderRadius: 8,
    marginTop: 20,
    backgroundColor: 'grey',
}

const ProfileScreen = () => {
  const { user }: any = useAuth();
  const inputRef = useRef<TextInput>(null);
  const [userData, setUserData] = useState<any>(user.user);
  const [editingField, setEditingField] = useState<any>(null);
  const [tempValue, setTempValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [makeOTPVisible, setMakeOTPVisible] = useState<any>(false);

  const defaultPhoneNumber: string = user.user.phone
  const defaultFirstName: string = user.user.firstName
  const defaultLastName: string = user.user.lastName

  const handleEdit = (field: any) => {
    setEditingField(field);
    setTempValue(userData[field]);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const checkIfButtonDisabled = () => {
    if (defaultPhoneNumber === userData.phone &&
        defaultFirstName === userData.firstName &&
        defaultLastName === userData.lastName) {
      return true;
    }
    return false;
  }

  const handleChangeInput = (value: string) => {
    setTempValue(value);
    checkIfButtonDisabled();
    setUserData((prevData: any) => ({
      ...prevData,
      [editingField]: value,
    }));
  };

  const renderInputWithCondition = (
    label: string,
    fieldKey: string,
    isEditable: boolean,
    value: string,
  ) => {
    if (editingField === fieldKey) {
      return (
        <>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={tempValue}
            onChangeText={e => handleChangeInput(e)}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        </>
      );
    } else {
      if (fieldKey === 'phone') {
        return (
          <View style={styles.infoRow}>
            <Text style={styles.value}>
              {fieldKey === 'phone' ? `+971${value}` : value}
            </Text>
            {isEditable && (
              <TouchableOpacity
                onPress={() => handleEdit(fieldKey)}
                disabled={!isEditable}
              >
                <EditIcon size={15} color={isEditable ? 'tomato' : 'grey'} />
              </TouchableOpacity>
            )}
          </View>
        );
      }

      return (
        <View style={styles.infoRow}>
          <Text style={styles.value}>{value}</Text>
          {isEditable && (
            <TouchableOpacity
              onPress={() => handleEdit(fieldKey)}
              disabled={!isEditable}
            >
              <EditIcon size={15} color={isEditable ? 'tomato' : 'grey'} />
            </TouchableOpacity>
          )}
        </View>
      );
    }
  };

  const renderField = (
    label: string,
    value: string,
    fieldKey: any,
    isLast: boolean,
    isEditable: boolean,
  ) => (
    <View key={fieldKey}>
      <View style={styles.fieldContainer}>
        <Text style={[styles.label, getCairoFont('600')]}>{label}</Text>
        {renderInputWithCondition(label, fieldKey, isEditable, value)}
      </View>
      {!isLast && <View style={styles.divider} />}
    </View>
  );

  const handleSaveProfile = async () => {

    if (defaultPhoneNumber !== userData.phone) {
      userData.phone = `+971${userData.phone}`;
      setMakeOTPVisible(true);
      return;
    }

    setLoading(true)

    const updateProfile = await handleEditProfile(userData);

    if (updateProfile) {
        setLoading(false)
        console.log(updateProfile)
        const userString = await AsyncStorage.getItem('user');
        const userInfoParse = userString ? JSON.parse(userString) : {};
        const updatedUser = {
          ...userInfoParse,
          userInfoParse: {
            ...userInfoParse.user,
            firstName: updateProfile.firstName,
            lastName: updateProfile.lastName,
            phone: updateProfile.phone,
          },
        };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        setUserData((prevData: any) => ({
            ...prevData,
            firstName: updateProfile.firstName || prevData.firstName,
            lastName: updateProfile.lastName || prevData.lastName,
            phone: updateProfile.phone || prevData.phone,
        }));
    }

  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {loading && <LoadingSpinner overlay /> }
        {makeOTPVisible && <OTPModal makeOTPVisible={makeOTPVisible} setMakeOTPVisible={setMakeOTPVisible}/>}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('pinfo')}</Text>
          {renderField(t('email'), userData?.email, 'email', false, false)}
          {renderField(
            t('firstName'),
            userData?.firstName,
            'firstName',
            false,
            true,
          )}
          {renderField(
            t('lastName'),
            userData?.lastName,
            'lastName',
            false,
            true,
          )}
          {renderField(t('phone'), userData?.phone, 'phone', true, true)}
        </View>

        <ModernButton
          disabled={checkIfButtonDisabled()}
          onPress={handleSaveProfile}
          title="Save"
          style={checkIfButtonDisabled() ? disabledButtonStyle : buttonStyle}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F0FA',
  },
  scrollViewContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#F0F0FA',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 30,
  },
  fieldContainer: {
    marginBottom: 10,
  },
  label: {
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 400,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: 'black',
    fontWeight: 600,
  },
  input: {
    fontSize: 15,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 0,
    color: 'black',
    fontWeight: 600,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  saveText: {
    color: '#fff',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 5,
  },
  prefix: {
    fontSize: 16,
    marginRight: 5,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    padding: 5,
  },
});
