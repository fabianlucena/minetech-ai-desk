import { Text } from 'react-native';

export default function Title({
  children
}) {
  return <Text
    style={{
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    }}
  >
    {children}
  </Text>;
}