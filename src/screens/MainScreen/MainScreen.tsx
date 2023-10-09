import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import ScreenLayout from '../../layout/Screen';
import {Text} from '../../components/Text';
import {colors} from '../../constants/Colors';
import Box from '../../components/layouts/Box';
import Button from '../../components/Button';
import {MainNavProps} from '../../navigation/types/types';
import {DrawerActions} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {get} from '../../services/asyncStorageFunction';
import {calculateAge} from '../../services/calculateAge';
const MainScreen: React.FC<MainNavProps<'mainScreen'>> = ({navigation}) => {
  const yearsFontSize = 62;

  const [age, setAge] = useState<string[]>();
  useEffect(() => {
    async function getDate() {
      const birthdate = await get('birth_date');
      if (birthdate) {
        const calculatedAge = calculateAge(birthdate);
        setAge(calculatedAge?.toString().split('.'));
      } else {
        navigation.navigate('pickBirthdayScreen');
      }
    }
    getDate();
  });
  return (
    <ScreenLayout innerContainerStyle={styles.innerContainerStyle}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 0,
          margin: 16,
        }}
        onPress={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}>
        <Feather name="menu" size={35} color={'black'} />
      </TouchableOpacity>
      <Box justifyContent="space-between" flex={1} alignItems="center">
        <Box flex={2} justifyContent="center">
          <Text fontFamily="medium" size={26}>
            your life clock
          </Text>
        </Box>
        <Box flex={1} justifyContent="flex-end">
          <Text fontFamily="medium" size={yearsFontSize} color={colors.accent}>
            {age && age[0]}
            <Text
              fontFamily="medium"
              size={yearsFontSize - 25}
              color={colors.accent}>
              .{age && age[1]}
            </Text>
          </Text>
        </Box>
      </Box>

      <Box flex={1} justifyContent="flex-end">
        <Button
          buttonStyle={styles.buttonStyle}
          textStyle={styles.buttonTextStyle}
          onPress={() => {}}>
          Take a screenshot
        </Button>
      </Box>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  innerContainerStyle: {
    justifyContent: 'space-between',
    flex: 1,
  },
  buttonStyle: {
    width: '95%',
    alignSelf: 'center',
  },
  buttonTextStyle: {
    fontSize: 16,
  },
});

export default MainScreen;
