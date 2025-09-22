// ./navigators/HomeStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Cart from '../screens/Cart';
import Checkout from '../screens/Checkout';
import SingleProduct from '../screens/SingleProduct';
import Wishlist from '../screens/WishList';

const Stack = createNativeStackNavigator();

export default function CartStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name='SingleProduct' component={SingleProduct} />
      <Stack.Screen name='WishList' component={Wishlist} />
    </Stack.Navigator>
  );
}
