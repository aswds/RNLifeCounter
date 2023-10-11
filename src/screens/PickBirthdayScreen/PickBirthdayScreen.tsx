import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import BirthdayDatePicker from '../../components/BirthPicker';
import Button from '../../components/Button';
import {Text} from '../../components/Text';
import {colors} from '../../constants/Colors';
import {MainNavProps} from '../../navigation/types/types';
import {get, set} from '../../services/asyncStorageFunction';
const PickBirthdayScreen: React.FC<MainNavProps<'pickBirthdayScreen'>> = ({
  navigation,
}) => {
  const [date, setDate] = useState<Date>();
  const [showPicker, setShowPicker] = useState<boolean>(false);
  function handleShowPicker(toShow: boolean) {
    setShowPicker(toShow);
  }
  useEffect(() => {
    async function getDate() {
      const birthdate = await get('birth_date');
      if (birthdate) {
        navigation.navigate('lifeCounter');
      }
    }
    getDate();
  }, []);
  function handleContinuePress() {
    if (date)
      set('birth_date', date.toISOString()).then(() => {
        navigation.navigate('lifeCounter');
      });
  }
  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{
        justifyContent: 'space-between',
        flexGrow: 1,
        padding: 16,
      }}>
      <View>
        <Text
          color="black"
          size={48}
          fontFamily="medium"
          style={{marginVertical: '10%'}}>
          Welcome
        </Text>
        <View style={{}}>
          <Text
            fontFamily="light"
            color="black"
            size={24}
            style={{marginBottom: '5%'}}>
            When's your birthday?
          </Text>
          {showPicker && (
            <BirthdayDatePicker
              onDateSelected={date => {
                setDate(new Date(date));
              }}
              handleShowPicker={handleShowPicker}
            />
          )}
          <Button
            activeOpacity={1}
            buttonStyle={{backgroundColor: 'lightgrey', height: 50}}
            textStyle={{color: date ? colors.accent : 'darkgrey'}}
            onPress={() => {
              setShowPicker(true);
            }}>
            {date
              ? date.toLocaleDateString('en-gb', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  timeZone: 'utc',
                })
              : 'DD/MM/YY'}
          </Button>
        </View>
      </View>

      <Button
        activeOpacity={0.6}
        onPress={handleContinuePress}
        buttonStyle={{
          backgroundColor: date ? colors.accent : 'grey',
        }}>
        Continue
      </Button>
    </ScrollView>
  );
};

export default PickBirthdayScreen;

const styles = StyleSheet.create({});
