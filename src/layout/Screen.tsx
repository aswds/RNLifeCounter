import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ScrollViewProps,
  ViewStyle,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from '../constants/Colors';

interface ScreenLayoutProps extends Omit<ScrollViewProps, 'children'> {
  children?: React.ReactNode;
  innerContainerStyle?: ViewStyle;
}

const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  innerContainerStyle,
  ...props
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.safeArea,
        {paddingTop: insets.top, paddingBottom: insets.bottom},
      ]}>
      <ScrollView
        contentContainerStyle={styles.container}
        contentInsetAdjustmentBehavior="never"
        {...props}>
        <View style={[styles.content, innerContainerStyle]}>{children}</View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flexGrow: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});

export default ScreenLayout;
