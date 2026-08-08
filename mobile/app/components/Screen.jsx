import { View } from 'react-native';
import globalStyles from '../global-styles';

export default function Screen({
  children,
  style,
  ...props
}) {
  style = {
    flex: 1,
    padding: 10,
    backgroundColor: globalStyles.screen.backgroundColor || globalStyles.backgroundColor,
    ...style,
  };

  return <View
    style={style}
    {...props}
  >
    {children}
  </View>;
}