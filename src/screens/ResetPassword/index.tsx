import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Alert } from 'react-native';
import ModernButton from '../../components/Button';
import { handleResetPassword } from '../../apis/handleResetPassword';

export default function ResetPassword({ route, navigation }) {
  const { email, code } = route.params;
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = async () => {
    if (!password || password !== confirm) {
      return Alert.alert('Error', 'Passwords do not match');
    }

    const res = await handleResetPassword({
        email,
        code,
        password
    })


    if ('error' in res) {
        return Alert.alert('Error', 'Something went wrong Please try again later!');
    }

    navigation.replace('Authentication');

    Alert.alert('Success', `Password reset for ${email} now you can login with your new password`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subTitle}>Enter the new password that you will be using to login.</Text>
      <TextInput
        placeholder="New password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <TextInput
        placeholder="Confirm password"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        style={styles.input}
      />
      <ModernButton title="Reset Password" onPress={handleSubmit}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  subTitle: {
    marginBottom: 20, 
    textAlign: 'center',
    color: '#555',
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
