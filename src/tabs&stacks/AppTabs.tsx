import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Home from '../screens/Home';
import { HomeIcon } from '../icons/Home';
import { CategoryIcon } from '../icons/Category';
import { ShoppingCartIcon } from '../icons/SHoppingCart';
import { UserIcon } from '../icons/UserIcon';
import WishList from '../screens/WishList';
import { HeartIcon } from '../icons/Heart';
import HomeStack from './HomeStack';
import AccountStack from './AccountStack';
import CategoriesStack from './CategoriesStack';
import CartStack from './CartStack';
import { t } from 'i18next';
import { getCairoFont } from '../ultis/getFont';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // no top header
        tabBarStyle: {
          height: 80, // Adjust height here
          paddingBottom: 8, // Optional: spacing for icons/text
          paddingTop: 8, // Optional: spacing for icons/text
          backgroundColor: '#fff', // Optional: customize background
          borderTopWidth: 1, // Optional: subtle border
          borderTopColor: '#eee',
          fontFamily: getCairoFont('700')
        },
        tabBarIcon: ({ focused }) => {
          const iconColor = focused ? '#ff6600' : '#757473';

          switch (route.name) {
            case 'Home':
              return <HomeIcon color={iconColor} size={27} />;
            case 'CategoriesStack':
              return <CategoryIcon color={iconColor} size={27} />;
            case 'Cart':
              return <ShoppingCartIcon color={iconColor} size={27} />;
            case 'WishList':
              return <HeartIcon color={iconColor} size={27} />; // Placeholder for WishList
            case 'AccountStack':
              return <UserIcon color={iconColor} size={27} />;
            default:
              return null;
          }
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },

        tabBarActiveTintColor: '#ff6600', // e.g. your brand color
        tabBarInactiveTintColor: '#A19E9D',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: t('home'),
        }}
      />
      <Tab.Screen
        name="CategoriesStack"
        component={CategoriesStack}
        options={{
          tabBarLabel: t('categories'),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartStack}
        options={{
          tabBarLabel: t('cart'),
        }}
      />

      <Tab.Screen
        name="WishList"
        component={WishList}
        options={{
          tabBarLabel: t('wishlist'),
        }}
      />

      <Tab.Screen
        name="AccountStack"
        component={AccountStack}
        options={{
          tabBarLabel: t('account'),
        }}
      />
    </Tab.Navigator>
  );
}
