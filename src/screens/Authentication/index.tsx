import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
} from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { LoginView } from './components/LoginView';
import { RegisterView } from './components/RegisterView';
import { useAuth } from '../../AuthContext';

export default function AuthScreen({ navigation, route }: any) {
  const [isLogin, setIsLogin] = useState(true);

  const { loginWithGoogle, user } = useAuth();

  // If already authenticated, kick the user back to the intended screen or Home
  React.useEffect(() => {
    if (!user) return;
    const target = route?.params?.redirectBack ?? route?.params?.params?.redirectBack;

    // Prefer navigating to an explicit target if provided
    if (target) {
      try {
        navigation.dispatch(CommonActions.navigate(target));
        return;
      } catch {}
    }

    // Otherwise go back if possible, else jump to Home tab
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      try {
        navigation.dispatch(CommonActions.navigate('AppTabs'));
        navigation.dispatch(CommonActions.navigate('Home'));
      } catch {}
    }
  }, [user, navigation, route]);

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    style={{ flex: 1 }}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
  >
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {isLogin && (
        <LoginView navigation={navigation} setIsLogin={setIsLogin}/>
      )}

      {!isLogin && (
        <RegisterView navigation={navigation} setIsLogin={setIsLogin}/>
      )}

      {/* Social buttons */}
      <View style={styles.socialContainer}>
        <Text style={styles.orText}>OR</Text>

        <TouchableOpacity style={styles.socialMediaGoogle} onPress={loginWithGoogle}>
          <View style={styles.socialMediaIconsWrapper}>
            <Image
              source={require('../../../src/assets/googleIcon.png')}
              style={styles.socialImage}
            />

            <Text style={styles.socialMediaText}>Sign in with Google</Text>
          </View>
        </TouchableOpacity>

        

        {/* <TouchableOpacity style={styles.socialFaceBook}>
          <View style={styles.socialMediaIconsWrapper}>
            <Image
              source={require('../../../src/assets/facebook.png')}
              style={styles.socialImage}
            />

            <Text style={styles.socialMediaWhiteText}>
              Sign in with FaceBook
            </Text>
          </View>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.socialApple}>
          <View style={styles.socialMediaIconsWrapper}>
            <Image
              source={require('../../../src/assets/applee.png')}
              style={styles.socialImage}
            />

            <Text style={styles.socialMediaWhiteText}>Sign in with Apple</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: Platform.select({ android: 28, ios: 0 }),
    flexGrow: 1,
    backgroundColor: '#fff',
    // justifyContent: 'center',
  },
  socialMediaGoogle: {
    backgroundColor: '#fff',
    borderColor: '#f4f6f6',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 0,
    marginBottom: 10,
    alignItems: 'center',
  },
  socialMediaText: {
    fontSize: 16,
    fontWeight: 500,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  socialMediaWhiteText: {
    fontSize: 16,
    fontWeight: 500,
    textAlign: 'center',
    letterSpacing: 0.5,
    color: '#fff',
  },
  socialMediaIconsWrapper: { flexDirection: 'row', alignItems: 'center' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 16,
  },
  socialImage: { width: 24, height: 24, marginRight: 10 },
  focusedWrapper: {
    borderColor: '#007AFF',
  },
  socialApple: {
    backgroundColor: 'black',
    borderColor: 'black',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 0,
    marginBottom: 10,
    alignItems: 'center',
  },
  socialFaceBook: {
    backgroundColor: '#5a76de',
    borderColor: '#5a76de',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 0,
    marginBottom: 10,
    alignItems: 'center',
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
  socialContainer: {
    marginTop: 30,
  },
  orText: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#aaa',
  },
  socialButton: {
    marginBottom: 10,
    borderRadius: 10,
  },
  appleButton: {
    height: 45,
    marginTop: 10,
    marginBottom: 20,
  }
});
