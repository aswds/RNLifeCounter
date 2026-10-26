import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {DrawerActions} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import ViewShot, {ViewShotRef} from 'react-native-view-shot';
import Button from '../../components/Button';
import {Text} from '../../components/Text';
import Box from '../../components/layouts/Box';
import {colors} from '../../constants/Colors';
import ScreenLayout from '../../layout/Screen';
import {MainNavProps} from '../../navigation/types/types';
import {hasAndroidPermission} from '../../services/androidPermission';
import {get} from '../../services/asyncStorageFunction';
import {getLifeWidgetDetails} from '../../services/widgetData';
import {ensureLifeWidgetBirthDate} from '../../services/widgetSync';

const MainScreen: React.FC<MainNavProps<'lifeCounter'>> = ({navigation}) => {
  const yearsFontSize = 62;
  const ref = useRef<ViewShotRef>(null);
  const hasSeededWidget = useRef(false);
  const [age, setAge] = useState<string[]>();
  const [buttonBackground, setButtonBackground] = useState<string>(
    colors.accent,
  );
  useEffect(() => {
    let isMounted = true;

    async function loadLifeClock() {
      const birthdate = await get('birth_date');
      if (birthdate) {
        const details = getLifeWidgetDetails(birthdate);
        if (isMounted) {
          setAge(details.yearsDisplay.split('.'));
        }
        if (!hasSeededWidget.current) {
          hasSeededWidget.current = true;
          // A one-time migration for birthdays saved before widgets stored the
          // birthday itself. This is not a recurring time/age synchronisation.
          ensureLifeWidgetBirthDate(details.birthDate).catch(() => undefined);
        }
      } else {
        navigation.navigate('pickBirthdayScreen');
      }
    }
    loadLifeClock();

    // Keep the in-app clock accurate during a long open session. Native widgets
    // calculate their own display from the birthday they received on save.
    const clockInterval = setInterval(loadLifeClock, 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(clockInterval);
    };
  }, [navigation]);

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
        style={styles.captureArea}
        ref={ref}
        options={{
          fileName: age ? `${age[0] ?? ''}.${age[1] ?? ''}` : 'Life Capture',
          format: 'jpg', // image extension
          quality: 0.9, // image quality
        }}>
        <TouchableOpacity
          style={styles.menuButton}
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
            buttonStyle={{
              ...styles.buttonStyle,
              backgroundColor: buttonBackground,
            }}
            textStyle={styles.buttonTextStyle}
            onPress={() => {
              setButtonBackground('transparent');
              const screenshot = ref.current?.capture?.();
              if (!screenshot) {
                setButtonBackground(colors.accent);
                return;
              }
              screenshot
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
  captureArea: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    flex: 1,
  },
  menuButton: {
    position: 'absolute',
    right: 0,
  },
});

export default MainScreen;
