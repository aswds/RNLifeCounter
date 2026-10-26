import React, {useEffect, useState} from 'react';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from '../constants/Colors';
import {Text} from './Text';

interface BirthdayDatePickerProps {
  visible: boolean;
  value?: Date;
  onDateSelected: (selectedDate: Date) => void;
  onClose: () => void;
}

const BirthdayDatePicker: React.FC<BirthdayDatePickerProps> = ({
  visible,
  value,
  onDateSelected,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const [draftDate, setDraftDate] = useState(value ?? new Date());

  useEffect(() => {
    if (visible) {
      setDraftDate(value ?? new Date());
    }
  }, [value, visible]);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      onClose();
      if (event.type === 'set' && selectedDate) {
        onDateSelected(selectedDate);
      }
      return;
    }

    if (selectedDate) {
      setDraftDate(selectedDate);
    }
  };

  const confirmDate = () => {
    onDateSelected(draftDate);
    onClose();
  };

  if (!visible) {
    return null;
  }

  if (Platform.OS === 'android') {
    return (
      <DateTimePicker
        testID="birthdayDatePicker"
        value={draftDate}
        mode="date"
        display="default"
        maximumDate={new Date()}
        onChange={onChange}
      />
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.sheet, {paddingBottom: Math.max(insets.bottom, 16)}]}
          onPress={event => event.stopPropagation()}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Pressable hitSlop={12} onPress={onClose}>
              <Text color={colors.accent} size={17} fontFamily="medium">
                Cancel
              </Text>
            </Pressable>
            <Text color={colors.accent} size={17} fontFamily="medium">
              Birthday
            </Text>
            <Pressable hitSlop={12} onPress={confirmDate}>
              <Text color={colors.accent} size={17} fontFamily="bold">
                Done
              </Text>
            </Pressable>
          </View>
          <DateTimePicker
            testID="birthdayDatePicker"
            value={draftDate}
            mode="date"
            display="inline"
            maximumDate={new Date()}
            onChange={onChange}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  handle: {
    alignSelf: 'center',
    width: 38,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#C7C7CC',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40,
  },
});

export default BirthdayDatePicker;
