import { View } from 'react-native';
import globalStyles from '../global-styles';

export default function Screen({
  children,
  style,
  ...props
}) {
  style = {
    ...globalStyles,
    ...globalStyles.screen,
    flex: 1,
    padding: 10,
    ...style,
  };

  return <View
    style={style}
    {...props}
  >
    {children}
  </View>;
}