import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import PickBirthdayScreen from '../../screens/PickBirthdayScreen/PickBirthdayScreen';
import {get} from '../../services/asyncStorageFunction';
import {MainNavProps, MainParamList} from '../types/types';
import MainScreen from '../../screens/MainScreen/MainScreen';
import DrawerNav from './Drawer/DrawerNav';

export function MainNav() {
  const Stack = createNativeStackNavigator<MainParamList>();
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function handleFirstLaunch() {
      const isFirstLaunch = await get('');
      if (isFirstLaunch) {
        setIsFirstLaunch(false);
        setLoading(false);
      }
    }
    handleFirstLaunch();
  }, []);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={isFirstLaunch ? 'pickBirthdayScreen' : 'mainScreen'}>
      <Stack.Screen name="pickBirthdayScreen" component={PickBirthdayScreen} />
      <Stack.Screen name="mainScreen" component={MainScreen} />
    </Stack.Navigator>
  );
}
