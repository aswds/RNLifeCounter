import * as React from 'react';
import {Button, View} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import MainScreen from '../../../screens/MainScreen/MainScreen';
import {MainNav} from '../MainNav';
import {Text} from '../../../components/Text';
import {colors} from '../../../constants/Colors';
import Box from '../../../components/layouts/Box';
import Feather from 'react-native-vector-icons/Feather';
import {Fonts} from '../../../../assets/fonts/fontPicker';

const Drawer = createDrawerNavigator();

function DrawerContent() {
  return (
    <DrawerContentScrollView
      style={{backgroundColor: colors.accent, flex: 1}}
      contentContainerStyle={{flexGrow: 1}}>
      <Box
        borderBottomWidth={1}
        borderColor={colors.primary}
        alignItems="center"
        justifyContent="flex-start"
        padding={15}
        flexDirection="row">
        <Text fontFamily="regular" color={colors.primary} size={24}>
          the time is ticking{' '}
        </Text>
      </Box>
      <DrawerItem
        label={'Change date'}
        onPress={() => {
          props.navigation.navigate('pickBirthdayScreen');
        }}
        labelStyle={{
          color: colors.primary,
          fontFamily: Fonts.medium,
        }}
        icon={() => (
          <Box width={24}>
            <Feather color={colors.primary} name="clock" size={20} />
          </Box>
        )}
      />
      <Box marginTop={'auto'} alignSelf="center" bottom={20}>
        <Text color="white">You live only once</Text>
      </Box>
    </DrawerContentScrollView>
  );
}

export default function DrawerNav() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={props => <DrawerContent {...props} />}
        screenOptions={{headerShown: false, drawerPosition: 'right'}}>
        <Drawer.Screen name="mainScreen" component={MainNav} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
