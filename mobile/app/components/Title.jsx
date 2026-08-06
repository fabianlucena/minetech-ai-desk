import { Text } from 'react-native';

export default function Title({
  children,
  style,
  ...props
}) {
  style = {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#D8B128',
    ...style,
  };

  return <Text
    style={style}
    {...props}
  >
    {children}
  </Text>;
}