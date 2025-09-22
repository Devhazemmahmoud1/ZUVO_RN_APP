import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import LoginScreen from './LoginScreen';
import SplashScreen from './screens/Splash';
// import Home from './screens/Home';
import Authentication from './screens/Authentication';
import OTP from './screens/OTP';
import ForgetPassword from './screens/ForgetPassword';
import ResetPassword from './screens/ResetPassword';
import AppTabs from './tabs&stacks/AppTabs';

const Stack = createNativeStackNavigator();

export default function UnauthenticatedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="AppTabs" component={AppTabs} />
      {/* <Stack.Screen name="Home" component={Home} /> */}
      <Stack.Screen name="Authentication" component={Authentication} />
      <Stack.Screen name="OTP" component={OTP} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
    </Stack.Navigator>
  );
}
