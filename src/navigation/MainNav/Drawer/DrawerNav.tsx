import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
  DrawerItem,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {Fonts} from '../../../../assets/fonts/fontPicker';
import {Text} from '../../../components/Text';
import Box from '../../../components/layouts/Box';
import {colors} from '../../../constants/Colors';
import {MainNav} from '../MainNav';
import {DrawerParamList} from '../../types/types';

const Drawer = createDrawerNavigator<DrawerParamList>();

function ClockIcon() {
  return (
    <Box width={24}>
      <Feather color={colors.primary} name="clock" size={20} />
    </Box>
  );
}

function DrawerContent({navigation, ...props}: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView
      {...props}
      style={styles.drawer}
      contentContainerStyle={styles.drawerContent}>
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
        label="Change date"
        onPress={() => {
          navigation.navigate('mainScreen', {screen: 'pickBirthdayScreen'});
        }}
        labelStyle={styles.drawerLabel}
        icon={ClockIcon}
      />
      <Box marginTop={'auto'} alignSelf="center" bottom={20}>
        <Text color="white" fontFamily={'bold'} size={16}>
          You live only once
        </Text>
      </Box>
    </DrawerContentScrollView>
  );
}

export default function DrawerNav() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={DrawerContent}
        screenOptions={{headerShown: false, drawerPosition: 'right'}}>
        <Drawer.Screen name="mainScreen" component={MainNav} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = {
  drawer: {backgroundColor: colors.accent, flex: 1},
  drawerContent: {flexGrow: 1},
  drawerLabel: {color: colors.primary, fontFamily: Fonts.medium},
} as const;
