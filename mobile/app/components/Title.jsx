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
    ...style,
    textAlign: 'center',
    color: '#D8B128',
  };

  return <Text
    style={style}
    {...props}
  >
    {children}
  </Text>;
}