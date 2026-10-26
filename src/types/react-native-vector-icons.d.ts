declare module 'react-native-vector-icons/Feather' {
  import type {ComponentType} from 'react';
  import type {TextProps} from 'react-native';

  export interface FeatherProps extends TextProps {
    color?: string;
    name: string;
    size?: number;
  }

  const Feather: ComponentType<FeatherProps>;
  export default Feather;
}
