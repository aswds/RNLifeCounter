import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ScrollViewProps,
  ViewStyle,
} from 'react-native';
import {colors} from '../constants/Colors';

interface ScreenLayoutProps extends React.PropsWithChildren, ScrollViewProps {
  innerContainerStyle?: ViewStyle;
}

const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  innerContainerStyle,
  ...props
}) => {
  return (
    <ScrollView contentContainerStyle={styles.container} {...props}>
      <View style={[styles.content, innerContainerStyle]}>{children}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // This allows the ScrollView to grow to fill the screen height
    backgroundColor: colors.primary, // Set your desired background color
  },
  content: {
    padding: 20, // Add padding to your content components as needed
    // Add styles for your content components here
  },
});

export default ScreenLayout;
