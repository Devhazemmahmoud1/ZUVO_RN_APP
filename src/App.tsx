import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from '../src/AuthContext';
import AuthenticatedStack from '../src//AuthenticatedStack';
import UnauthenticatedStack from '../src/UnauthenticatedStack';
import { ActivityIndicator, Alert, AppState, Platform, View } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import { useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoadingProvider } from './LoadingContext';
import NetInfo from '@react-native-community/netinfo';
import { SortingProvider } from './SortingContext';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient } from './ultis/queryClient';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { AddressProvider } from './AddressProvider';
import { I18nextProvider } from 'react-i18next';
import { LanguageProvider } from './LanguageProvider';
import i18n from './localization/i18n';
import { focusManager, onlineManager } from '@tanstack/react-query';

function RootNavigation() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return user ? <AuthenticatedStack /> : <UnauthenticatedStack />;
}

export default function App() {
  // const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    Orientation.lockToPortrait();

    Orientation.getOrientation(orientation => {
      console.log('Current orientation is:', orientation);
    });

    GoogleSignin.configure({
      webClientId:
        '105183099704-fo6367oq8q2erlulsmmmh8o42ac430b4.apps.googleusercontent.com', // from Google Console (type = Web)
      iosClientId:
        '105183099704-oc0rkcfn0bro6mfuofc5tfasqlu29nf8.apps.googleusercontent.com',
      offlineAccess: true, // if you want refresh tokens
    });
  }, []);

  useEffect(() => {
    const checkAppStatus = async () => {
      try {
        const netState = await NetInfo.fetch();

        console.log(netState);

        // 1. Internet check
        if (!netState.isConnected) {
          Alert.alert(
            'No Internet',
            'Connect to the internet to use this app.',
            [{ text: 'Exit', onPress: () => {} }],
          );
          return;
        }

        // 2. VPN check (cross-platform heuristic)
        let isVPN = false;
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
          const detailsStr = JSON.stringify(
            netState.details || {},
          ).toLowerCase();
          if (
            detailsStr.includes('tun') ||
            detailsStr.includes('ppp') ||
            detailsStr.includes('ipsec')
          ) {
            isVPN = true;
          }
        }

        if (isVPN) {
          Alert.alert('VPN Detected', 'Please disable VPN to use this app.', [
            { text: 'Exit', onPress: () => {} },
          ]);
          return;
        }

        // All good
        // setAppReady(true);
      } catch (err) {
        console.error('Error during VPN/Internet check:', err);
      }
    };

    checkAppStatus();
  }, []);

  // if (!appReady) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator size="large" color="#007AFF" />
  //     </View>
  //   );
  // }

  onlineManager.setEventListener(setOnline =>
    NetInfo.addEventListener(state => setOnline(!!state.isConnected))
  );

  focusManager.setEventListener(handleFocus => {
    const sub = AppState.addEventListener('change', state => {
      handleFocus(state === 'active');
    });
    return () => sub.remove();
  });

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: createAsyncStoragePersister({ storage: AsyncStorage }),
        maxAge: 24 * 60 * 60 * 1000,
        buster: 'v1.0.3',
      }}
    >
      <I18nextProvider i18n={i18n}>
        <LanguageProvider>
          <AddressProvider>
            <Toast position="top" topOffset={50} />
            <LoadingProvider>
              <AuthProvider>
                <SortingProvider>
                  <NavigationContainer>
                    <RootNavigation />
                  </NavigationContainer>
                </SortingProvider>
              </AuthProvider>
            </LoadingProvider>
          </AddressProvider>
        </LanguageProvider>
      </I18nextProvider>
    </PersistQueryClientProvider>
  );
}
