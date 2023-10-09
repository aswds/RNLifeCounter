import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import React from 'react';

interface BoxProps extends ViewStyle, React.PropsWithChildren {}

const Box: React.FC<BoxProps> = ({children, ...props}) => {
  return <View style={[styles.centeredContainer, props]}>{children}</View>;
};

export default Box;

const styles = StyleSheet.create({
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
