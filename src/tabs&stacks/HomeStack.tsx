// ./navigators/HomeStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import ProductsList from '../screens/ProductsList';
import SingleProduct from '../screens/SingleProduct';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Products" component={ProductsList} />
      <Stack.Screen name='SingleProduct' component={SingleProduct} />
    </Stack.Navigator>
  );
}
