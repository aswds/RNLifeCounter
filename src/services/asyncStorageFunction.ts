import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

export async function get(key: string) {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    Alert.alert('Ooops!', 'Error occured, please try again.');
  }
}
export async function set(key: string, value: string): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch {
    Alert.alert('Ooops!', 'Error occured, please try again.');
    return false;
  }
}
