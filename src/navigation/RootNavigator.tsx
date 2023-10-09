import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {MainNav} from './MainNav/MainNav';
import DrawerNav from './MainNav/Drawer/DrawerNav';
const RootNavigator = () => {
  return <DrawerNav />;
};

export default RootNavigator;

const styles = StyleSheet.create({});
