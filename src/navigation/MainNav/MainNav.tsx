import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import MainScreen from '../../screens/MainScreen/MainScreen';
import PickBirthdayScreen from '../../screens/PickBirthdayScreen/PickBirthdayScreen';
import {get} from '../../services/asyncStorageFunction';
import {MainParamList} from '../types/types';

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
      initialRouteName={isFirstLaunch ? 'pickBirthdayScreen' : 'lifeCounter'}>
      <Stack.Screen name="pickBirthdayScreen" component={PickBirthdayScreen} />
      <Stack.Screen name="lifeCounter" component={MainScreen} />
    </Stack.Navigator>
  );
}
