import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import HomeScreen from './screens/Home';
import SplashScreen from './screens/Splash';
import AppTabs from './tabs&stacks/AppTabs';
import AddressDetails from './screens/AddressDetails';
import ProductsList from './screens/ProductsList';

const Stack = createNativeStackNavigator();

export default function AuthenticatedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="AppTabs" component={AppTabs} />
      {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
      <Stack.Screen name="AddressDetails" component={AddressDetails} />
      <Stack.Screen name="ProductList" component={ProductsList} />
    </Stack.Navigator>
  );
}
