import React from 'react';
import {ColorValue, Text as RNText} from 'react-native';
import {Fonts} from '../../assets/fonts/fontPicker';
import {colors} from '../constants/Colors';
type TextProps = Omit<React.ComponentProps<typeof RNText>, 'children'> & {
  children?: React.ReactNode;
  size: number;
  color?: ColorValue;
  fontFamily?: keyof typeof Fonts;
};

export const Text: React.FC<TextProps> = ({
  size,
  color = colors.accent,
  fontFamily,
  children,
  ...props
}) => {
  return (
    <RNText
      {...props}
      style={[
        props?.style,
        {color, fontSize: size, fontFamily: Fonts[fontFamily ?? 'regular']},
      ]}>
      {children}
    </RNText>
  );
};
