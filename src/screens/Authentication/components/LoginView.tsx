import { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { handleSignIn } from '../../../apis/handleSignIn';
import { loginSchema } from '../../../validation/loginSchema';
import { useAuth } from '../../../AuthContext';
import FullscreenLoader from '../../../components/Loader';

export const LoginView = ({ navigation, setIsLogin }: any) => {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    // setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    console.log('📦 Form Submitted:', data);
    const res = await handleSignIn(data);

    console.log(res)    

    if ('success' in res) {
      setIsLoading(false)
      Alert.alert('Error', res.message.error || 'Something went wrong');
      return;
    }

    await login(res)
    // navigation.navigate('Home');
    setIsLoading(false)
  };

  const handleFocus = (field: string) => setFocusedInput(field);

  return (
    <>
      <FullscreenLoader visible={isLoading} />
      <Image
        source={require('../../../../src/assets/main_logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            autoCapitalize="none"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            onFocus={() => handleFocus('email')}
            onBlur={onBlur}
            style={[
              styles.input,
              focusedInput === 'email' && styles.focusedInput,
            ]}
            placeholderTextColor={'#969593'}
            placeholder="Email / Phone"
            // left={<TextInput.Icon icon="email" />}
          />
        )}
      />

      <Text
        style={styles.forgetPassword}
        onPress={() => navigation.navigate('ForgetPassword')}
      >
        Forgot Password?
      </Text>

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            autoCapitalize="none"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            style={[
              styles.input,
              focusedInput === 'password' && styles.focusedInput,
            ]}
            placeholderTextColor={'#969593'}
            placeholder="Password"
            onFocus={() => handleFocus('password')}
            onBlur={onBlur}
          />
        )}
      />

      <TouchableOpacity
        // mode="contained"
        style={styles.button}
        onPress={() => {
          console.log('Submit pressed');
          console.log(errors); // ← add this
          handleSubmit(onSubmit)();
        }}
      >
        <Text style={styles.buttonTextColor}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(false)}>
        <Text style={styles.switchText}>
          Don't have an account?{' '}
          <Text style={styles.underLineOrder}>Sign-up</Text>
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    position: 'relative',
    left: 105,
    marginTop: 100,
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
    borderColor: '#7d3c98', // 👈 blue when focused
  },
  button: {
    height: 40,
    backgroundColor: '#7d3c98',
  },
  buttonTextColor: {
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 10,
    fontWeight: '500',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  switchText: {
    textAlign: 'center',
    marginTop: 15,
    color: '#666',
  },
  underLineOrder: {
    textDecorationLine: 'underline',
    color: '#7d3c98',
  },
  forgetPassword: {
    fontWeight: '500',
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'right',
    color: '#7d3c98',
  },
});
