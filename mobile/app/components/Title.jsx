import { Text } from 'react-native';
import globalStyles from '../global-styles';

export default function Title({
  children,
  style,
  ...props
}) {
  style = {
    ...globalStyles.title,
    ...style,
  };

  return <Text
    style={style}
    {...props}
  >
    {children}
  </Text>;
}