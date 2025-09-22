import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Account from '../screens/Account';
import Profile from '../screens/Profile';
import Cart from '../screens/Cart';
import Wishlist from '../screens/WishList';

const Stack = createNativeStackNavigator();

export default function AccountStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name='Cart' component={Cart} />
      <Stack.Screen name='WishList' component={Wishlist} />
    </Stack.Navigator>
  );
}
