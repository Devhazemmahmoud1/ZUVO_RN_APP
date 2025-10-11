import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { handleGoogleSignIn } from '../src/apis/handleGoogleSignIn';
import { setAuthFailedHandler } from './ultis/axiosInstance';

export type AuthUser = {
  name: string;
  email: string;
  photo?: string;
  id: string;
  provider: 'google' | 'manual';
  refresh_token: any
  access_token: any
};

type AuthContextType = {
  user: AuthUser | null;
  login: (userData: AuthUser) => Promise<void>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<boolean>;
  isLoading: boolean;
};




const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => useContext(AuthContext)!;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
      setIsLoading(false);
    };

    loadUser();
    // Subscribe to auth failures coming from axios (e.g., refresh failed)
    setAuthFailedHandler(() => {
      setUser(null);
    });
    return () => setAuthFailedHandler(null);
  }, []);

  const login = async (userData: AuthUser) => {
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    await AsyncStorage.setItem('refreshToken', userData.refresh_token);
    await AsyncStorage.setItem('accessToken', userData.access_token); // Assuming id is used as a token
    setUser(userData);
  };

  const loginWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo: any = await GoogleSignin.signIn();

      if (userInfo.type !== 'cancelled') {
        const userToken = await handleGoogleSignIn(userInfo);
        await login(userToken);
        return true
      }

      return false;
    } catch (error) {
      console.error('Google Sign-In error:', error);
      return false
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('accessToken');
    try {
      await GoogleSignin.signOut(); // Sign out from Google if logged in
      setUser(null);
      return true
    } catch (err) {
      console.warn('Google sign-out error:', err);
      return false
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
