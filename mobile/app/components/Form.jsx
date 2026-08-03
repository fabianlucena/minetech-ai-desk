import { View, Text } from 'react-native';
import Title from './Title.jsx';

export default function Form({
  title,
  children,
  onSubmit,
  //navigation,
}) {
  return <View>
    {title && <Title>{title}</Title>}
    {children}
    {onSubmit && <Text onPress={onSubmit}>Enviar</Text>}
  </View>;
}