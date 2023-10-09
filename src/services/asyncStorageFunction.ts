import AsyncStorage from '@react-native-community/async-storage';
import {Alert} from 'react-native';

export async function get(key: string) {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    Alert.alert('Ooops!', 'Error occured, please try again.');
  }
}
export async function set(key: string, value: any) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    Alert.alert('Ooops!', 'Error occured, please try again.');
  }
}
export async function setStringValue(key: string, value: any) {
  try {
    const stringifiedValue = JSON.stringify(value);
    return await AsyncStorage.setItem(key, stringifiedValue);
  } catch (error) {
    Alert.alert('Ooops!', 'Error occured, please try again.');
  }
}
