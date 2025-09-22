import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Alert } from 'react-native';
import ModernButton from '../../components/Button';
import FullscreenLoader from '../../components/Loader';
import { handleSendOTPForForgetPassword } from '../../apis/handleOTPForResetPassword';

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    if (!email) return Alert.alert('Error', 'Please enter your email');
    // simulate sending OTP
    setIsLoading(true);

    const res = await handleSendOTPForForgetPassword(email);

    if ('error' in res) {
      setIsLoading(false);
      return Alert.alert('Error', res.message.error);
    }

    setIsLoading(false)
    navigation.navigate('OTP', { email, type: 'reset' });
  };

  return (
    <View style={styles.container}>
        <FullscreenLoader visible={isLoading} />
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subTitle}>Enter your email address to receive OTP</Text>

      <TextInput
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={[
              styles.input,
            ]}
            placeholderTextColor={'#969593'}
            placeholder="Email address"
          />

    <ModernButton title="Reset Password" onPress={handleReset}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
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
});
