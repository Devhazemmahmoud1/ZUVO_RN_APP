// ./navigators/HomeStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Categories from '../screens/Categories';
import ProductsList from '../screens/ProductsList';
import SingleProduct from '../screens/SingleProduct';

const Stack = createNativeStackNavigator();

export default function CategoriesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Categories" component={Categories} />
      <Stack.Screen name="ProductsList" component={ProductsList} />
      <Stack.Screen name='SingleProduct' component={SingleProduct} />
    </Stack.Navigator>
  );
}
