import React from 'react';
import {Text as RNText} from 'react-native';
import {Fonts} from '../../assets/fonts/fontPicker';
import {colors} from '../constants/Colors';
interface TextProps
  extends React.ComponentProps<typeof RNText>,
    React.PropsWithChildren {
  size: number;
  color?: string;
  fontFamily: keyof typeof Fonts;
}

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
