// BirthdayDatePicker.tsx
import React, {useState} from 'react';
import {View} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

interface BirthdayDatePickerProps {
  onDateSelected: (selectedDate: string) => void;
  handleShowPicker: (show: boolean) => void;
}

const BirthdayDatePicker: React.FC<BirthdayDatePickerProps> = ({
  onDateSelected,
  handleShowPicker,
}) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  function handleLocalShow(toShow: boolean) {
    setShow(toShow);
    handleShowPicker(toShow);
  }

  const onChange = (event: DateTimePickerEvent, selectedDate) => {
    const currentDate = selectedDate;

    handleLocalShow(false);
    if (event.type === 'set') {
      onDateSelected(currentDate);
    }
  };

  return (
    <DateTimePicker
      testID="dateTimePicker"
      value={date}
      mode={mode}
      is24Hour={true}
      onChange={onChange}
      onTouchCancel={() => console.log('cancel')}
    />
  );
};

export default BirthdayDatePicker;
