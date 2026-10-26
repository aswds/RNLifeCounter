import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {colors} from '../../constants/Colors';
import MainScreen from '../../screens/MainScreen/MainScreen';
import PickBirthdayScreen from '../../screens/PickBirthdayScreen/PickBirthdayScreen';
import {get} from '../../services/asyncStorageFunction';
import {MainParamList} from '../types/types';

export function MainNav() {
  const Stack = createNativeStackNavigator<MainParamList>();
  const [initialRoute, setInitialRoute] = useState<
    keyof MainParamList | undefined
  >();

  useEffect(() => {
    async function determineInitialRoute() {
      const storedBirthDate = await get('birth_date');
      setInitialRoute(storedBirthDate ? 'lifeCounter' : 'pickBirthdayScreen');
    }
    determineInitialRoute();
  }, []);

  if (!initialRoute) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={initialRoute}>
      <Stack.Screen name="pickBirthdayScreen" component={PickBirthdayScreen} />
      <Stack.Screen name="lifeCounter" component={MainScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    flex: 1,
    justifyContent: 'center',
  },
});
