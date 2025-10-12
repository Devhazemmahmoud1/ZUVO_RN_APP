import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Account from '../screens/Account';
import Profile from '../screens/Profile';
import Cart from '../screens/Cart';
import Wishlist from '../screens/WishList';
import PaymentMethodsScreen from '../screens/PaymentMethods';
import SecuritySettingsScreen from '../screens/Security/SecurityScreen';
import ChangePasswordScreen from '../screens/ChangePassword';
import OrdersScreen from '../screens/Orders';
import TrackingDetailsScreen from '../screens/OrderTracking';
import ProductReviewWithItemScreen from '../screens/Reviews/ProductReview';
import ReturnsScreen from '../screens/Returns';
import ReturnCanceledScreen from '../screens/Returns/ReturnCanceled';
import ReturnIssuedScreen from '../screens/Returns/ReturnIssued';
import ReturnSummaryScreen from '../screens/Returns/ReturnSummary';
import RefundTrackScreen from '../screens/Returns/RefundTrack';
import OrderSummaryScreen from '../screens/OrderSummary';
import Authentication from '../screens/Authentication';

const Stack = createNativeStackNavigator();

export default function AccountStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name='Cart' component={Cart} />
      <Stack.Screen name='WishList' component={Wishlist} />
      <Stack.Screen name='PaymentMethods' component={PaymentMethodsScreen} />
      <Stack.Screen name='Security' component={SecuritySettingsScreen} />
      <Stack.Screen name='ChangePassword' component={ChangePasswordScreen} />   
      <Stack.Screen name='Orders' component={OrdersScreen} />
      <Stack.Screen name='OrderTracking' component={TrackingDetailsScreen} />
      <Stack.Screen name='ProductReview' component={ProductReviewWithItemScreen} />
      <Stack.Screen name='Returns' component={ReturnsScreen} />
      <Stack.Screen name='ReturnCanceled' component={ReturnCanceledScreen} />
      <Stack.Screen name='ReturnIssued' component={ReturnIssuedScreen} />
      <Stack.Screen name='ReturnSummary' component={ReturnSummaryScreen} />
      <Stack.Screen name='RefundTrack' component={RefundTrackScreen} />
      <Stack.Screen name='OrderSummary' component={OrderSummaryScreen} />
      <Stack.Screen name='Authentication' component={Authentication} />
    </Stack.Navigator>
  );
}
