import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type MainParamList = {
  pickBirthdayScreen: undefined;
  mainScreen: undefined;
};

export type MainNavProps<T extends keyof MainParamList> =
  NativeStackScreenProps<MainParamList, T>;
