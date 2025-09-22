import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
// import CountryPicker from 'react-native-country-picker-modal';
import { useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from '../../../validation/registerSchema';
import { handleSignUp } from '../../../apis/handleSignUp';

export const RegisterView = ({ navigation, setIsLogin }: any) => {
  const [countryCode, setCountryCode] = useState<any>('AE');
  const phoneInputRef = useRef<PhoneInput>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    // setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: any) => {

    console.log('📦 Form Submitted:', data);
    const res = await handleSignUp(data);

    if ('success' in res) {
      Alert.alert('Success', res.message.error || 'Something went wrong');
      return;
    }

    navigation.navigate('OTP', { email: data.email, type: 'register' });
  };

  const handleFocus = (field: string) => setFocusedInput(field);

  return (
    <>
      <Text style={styles.registerTitle}>Create your Account</Text>

      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            placeholder="First Name *"
            autoCapitalize="none"
            onChangeText={onChange}
            style={[
              styles.input,
              focusedInput === 'firstName' && styles.focusedInput,
              errors.firstName && styles.error,
            ]}
            onFocus={() => handleFocus('firstName')}
            onBlur={onBlur}
          />
        )}
      />

      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            style={[
              styles.input,
              focusedInput === 'lastName' && styles.focusedInput,
              errors.lastName && styles.error,
            ]}
            onFocus={() => handleFocus('lastName')}
            onBlur={onBlur}
            placeholder="Last Name * "
            autoCapitalize="none"
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            style={[
              styles.input,
              focusedInput === 'email' && styles.focusedInput,
              errors.email && styles.error,
            ]}
            onFocus={() => handleFocus('email')}
            placeholder="Email Address *"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />

      <View style={styles.phoneNumberWrapper}>
        <View style={styles.pickerContainer}>
          <View style={styles.picker}>
            {/* <CountryPicker
              countryCode={countryCode}
              withEmoji
              withFlag
              withFilter
              withCallingCode
              onSelect={countryCodes => {
                setCountryCode(countryCodes.cca2);
              }}
            /> */}
          </View>
        </View>

        <Controller
          control={control}
          name="phoneNumber"
          render={({ field: { onChange, value } }) => (
            <PhoneInput
              key={countryCode}
              ref={phoneInputRef}
              defaultValue={value}
              defaultCode={countryCode.toString()}
              layout="first"
              onChangeFormattedText={text => onChange(text.replace(/\D/g, ''))}
              withShadow={false}
              autoFocus={false}
              containerStyle={[styles.phoneContainer, { width: '85%' }]}
              textContainerStyle={[
                styles.phoneTextContainer,
                { width: '100%' },
              ]}
              codeTextStyle={styles.phoneCodeText}
              textInputStyle={styles.phoneInputText}
              countryPickerButtonStyle={{ display: 'none' }}
              flagButtonStyle={{}}
              withDarkTheme
            />
          )}
        />
      </View>

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Password *"
            secureTextEntry
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            style={[
              styles.input,
              focusedInput === 'password' && styles.focusedInput,
              errors.password && styles.error,
            ]}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Confirm Password *"
            secureTextEntry
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            style={[
              styles.input,
              focusedInput === 'confirmPassword' && styles.focusedInput,
              errors.confirmPassword && styles.error,
            ]}
          />
        )}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonTextColor}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(true)}>
        <Text style={styles.switchText}>
          Already have an account?{' '}
          <Text style={styles.underLineOrder}>Sign-in</Text>
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  registerTitle: {
    paddingTop: 100,
    paddingBottom: 20,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 0,
    textAlign: 'left',
    color: '#333',
  },
  input: {
    fontSize: 13,
    marginBottom: 15,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: '#E5E4E2',
    height: 45,
    paddingHorizontal: 15,
  },
  focusedInput: {
    borderColor: '#7d3c98',
  },
  error: {
    borderColor: 'red',
  },
  underLineOrder: {
    textDecorationLine: 'underline',
    color: '#7d3c98',
  },
  switchText: {
    textAlign: 'center',
    marginTop: 15,
    color: '#666',
  },
  buttonTextColor: {
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 10,
    fontWeight: '500',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  button: {
    height: 40,
    backgroundColor: '#7d3c98',
  },
  phoneTextContainer: {
    paddingVertical: 0,
    backgroundColor: '#fff',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: '#E5E4E2',
  },
  phoneCodeText: {
    fontSize: 13,
    color: '#000',
    borderColor: '#E5E4E2',
  },
  phoneInputText: {
    fontSize: 13,
    color: '#000',
    paddingVertical: 0,
    borderColor: '#E5E4E2',
  },
  phoneNumberWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#E5E4E2',
  },
  pickerContainer: {
    borderWidth: 1,
    borderRightWidth: 0,
    position: 'relative',
    bottom: 7,
    borderColor: '#ccc',
    borderRadius: 0,
    padding: 6,
    width: 60,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneContainer: {
    height: 45,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: '#E5E4E2',
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  picker: {
    position: 'relative',
    bottom: 2,
  },
});
