import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {DrawerActions} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  NativeModules,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import ViewShot from 'react-native-view-shot';
import Button from '../../components/Button';
import {Text} from '../../components/Text';
import Box from '../../components/layouts/Box';
import {colors} from '../../constants/Colors';
import ScreenLayout from '../../layout/Screen';
import {MainNavProps} from '../../navigation/types/types';
import {hasAndroidPermission} from '../../services/androidPermission';
import {get} from '../../services/asyncStorageFunction';
import {calculateAge} from '../../services/calculateAge';

const MainScreen: React.FC<MainNavProps<'lifeCounter'>> = ({navigation}) => {
  const yearsFontSize = 62;
  const {RNSharedWidget} = NativeModules;
  const ref = useRef<ViewShot>(); // should be inside the component
  const [age, setAge] = useState<string[]>();
  const [buttonBackground, setButtonBackground] = useState<'none' | 'flex'>(
    colors.accent,
  );
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
        (_status: number) => _status,
      );
    }
  };

  async function savePicture(uri: string) {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }
    try {
      await CameraRoll.save(uri, {type: 'photo', album: 'LifeSpan Tracker'});
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <ScreenLayout innerContainerStyle={styles.innerContainerStyle}>
      <ViewShot
        style={{
          flex: 1,
          backgroundColor: colors.primary,
          alignItems: 'center',
        }}
        ref={ref}
        options={{
          fileName: age?.length > 0 ? `${age[0]}.${age[1]}` : 'Life Capture', // screenshot image name
          format: 'jpg', // image extension
          quality: 0.9, // image quality
        }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 0,
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
          </Box>
        </Box>
        <Box flex={1} justifyContent="flex-end" width={'100%'}>
          <Button
            buttonStyle={[
              styles.buttonStyle,
              {backgroundColor: buttonBackground},
            ]}
            textStyle={styles.buttonTextStyle}
            onPress={() => {
              setButtonBackground('transparent');
              ref?.current
                ?.capture()
                .then(uri => {
                  savePicture(uri).then(() =>
                    Alert.alert(
                      'Screenshot Saved',
                      "You can access it from your device's file manager or gallery app.",
                    ),
                  );
                })
                .finally(() => {
                  setButtonBackground(colors.accent);
                });
            }}>
            Take a screenshot
          </Button>
        </Box>
      </ViewShot>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  innerContainerStyle: {
    justifyContent: 'space-between',
    flex: 1,
  },
  buttonStyle: {
    width: '100%',
    alignSelf: 'center',
  },
  buttonTextStyle: {
    fontSize: 16,
  },
});

export default MainScreen;
