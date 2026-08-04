import { View } from 'react-native';

export default function Screen({
  children,
  style,
  ...props
}) {
  style = {
    flex: 1,
    padding: 10,
    backgroundColor: '#e6e6e6',
    ...style,
  };

  return <View
    style={style}
    {...props}
  >
    {children}
  </View>;
}