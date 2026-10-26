import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import BirthdayDatePicker from '../../components/BirthPicker';
import Button from '../../components/Button';
import {Text} from '../../components/Text';
import {colors} from '../../constants/Colors';
import ScreenLayout from '../../layout/Screen';
import {MainNavProps} from '../../navigation/types/types';
import {get, set} from '../../services/asyncStorageFunction';
import {ensureLifeWidgetBirthDate} from '../../services/widgetSync';
const PickBirthdayScreen: React.FC<MainNavProps<'pickBirthdayScreen'>> = ({
  navigation,
}) => {
  const [date, setDate] = useState<Date>();
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadExistingDate() {
      const birthdate = await get('birth_date');
      if (birthdate) {
        const storedDate = new Date(birthdate);
        if (!Number.isNaN(storedDate.getTime())) {
          setDate(storedDate);
        }
      }
    }
    loadExistingDate();
  }, []);

  async function handleContinuePress() {
    if (!date || isSaving) return;

    setIsSaving(true);
    try {
      const birthDate = date.toISOString();
      const didSave = await set('birth_date', birthDate);
      if (!didSave) return;

      // This is the only hand-off to native storage. From here each widget
      // calculates and schedules its own clock without app-side polling.
      const didSync = await ensureLifeWidgetBirthDate(birthDate);
      if (!didSync) {
        Alert.alert(
          'Widget not updated',
          'Your birthday was saved. Please tap Continue again to retry the widget update.',
        );
        return;
      }

      navigation.navigate('lifeCounter');
    } catch {
      Alert.alert('Could not save your birthday', 'Please try again.');
    } finally {
      setIsSaving(false);
    }
  }
  return (
    <ScreenLayout innerContainerStyle={styles.page} bounces={false}>
      <View>
        <Text
          color="black"
          size={46}
          fontFamily="medium"
          style={styles.title}>
          Welcome
        </Text>
        <View>
          <Text
            fontFamily="light"
            color="black"
            size={24}
            style={styles.question}>
            When's your birthday?
          </Text>
          <Button
            activeOpacity={0.75}
            buttonStyle={styles.dateButton}
            textStyle={date ? styles.selectedDateText : styles.emptyDateText}
            onPress={() => setShowPicker(true)}>
            {date
              ? date.toLocaleDateString('en-gb', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'Choose your date of birth'}
          </Button>
        </View>
      </View>

      <Button
        activeOpacity={0.6}
        disabled={!date || isSaving}
        onPress={handleContinuePress}
        buttonStyle={date ? styles.continueButton : styles.disabledContinueButton}>
        {isSaving ? 'Saving…' : 'Continue'}
      </Button>
      <BirthdayDatePicker
        visible={showPicker}
        value={date}
        onDateSelected={setDate}
        onClose={() => setShowPicker(false)}
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  page: {
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  title: {
    marginTop: 20,
    marginBottom: 56,
    letterSpacing: -1.2,
  },
  question: {
    marginBottom: 18,
  },
  dateButton: {
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.input,
  },
  selectedDateText: {
    color: colors.accent,
  },
  emptyDateText: {
    color: '#8E8E93',
  },
  continueButton: {
    backgroundColor: colors.accent,
  },
  disabledContinueButton: {
    backgroundColor: '#A1A1A1',
  },
});

export default PickBirthdayScreen;
