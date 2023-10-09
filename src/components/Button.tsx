import React, {ReactNode} from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {Text} from './Text';
import {colors} from '../constants/Colors';

interface CustomButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  children: ReactNode;
  buttonStyle?: ViewStyle;
  textStyle?: object;
}

const Button: React.FC<CustomButtonProps> = ({
  children,
  buttonStyle,
  textStyle,
  ...props
}) => {
  return (
    <TouchableOpacity style={[styles.button, buttonStyle]} {...props}>
      <Text
        style={[styles.text, textStyle]}
        fontFamily="regular"
        size={textStyle?.fontSize ?? 20}
        color={textStyle?.color ?? colors.primary}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    height: 60,
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
});
export default Button;
