import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  NativeModules,
  Platform,
} from 'react-native';
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
import ViewShot from 'react-native-view-shot';
import {hasAndroidPermission} from '../../services/androidPermission';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

const MainScreen: React.FC<MainNavProps<'lifeCounter'>> = ({navigation}) => {
  const yearsFontSize = 62;
  const {RNSharedWidget} = NativeModules;
  const ref = useRef<ViewShot>(); // should be inside the component
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
    getData();
  });

  const getData = async () => {
    if (age?.length > 0) {
      RNSharedWidget.setData(
        'lifeCounter',
        JSON.stringify({
          years_decimal: `${age[0]}.`,
          years_float: age[1],
        }),
        (_status: number) => console.log(_status),
      );
    }
  };

  async function savePicture(uri: string) {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }

    CameraRoll.save(uri, {type: 'photo', album: 'Life Counter'});
  }
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
          <ViewShot
            ref={ref}
            options={{
              fileName:
                age?.length > 0 ? `${age[0]}.${age[1]}` : 'Life Capture', // screenshot image name
              format: 'jpg', // image extension
              quality: 0.9, // image quality
            }}>
            <Text
              fontFamily="medium"
              size={yearsFontSize}
              color={colors.accent}>
              {age && age[0]}
              <Text
                fontFamily="medium"
                size={yearsFontSize - 25}
                color={colors.accent}>
                .{age && age[1]}
              </Text>
            </Text>
          </ViewShot>
        </Box>
      </Box>
      <Box flex={1} justifyContent="flex-end">
        <Button
          buttonStyle={styles.buttonStyle}
          textStyle={styles.buttonTextStyle}
          onPress={() => {
            ref?.current?.capture().then(uri => savePicture(uri));
          }}>
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
