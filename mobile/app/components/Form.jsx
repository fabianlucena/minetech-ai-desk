import { View } from 'react-native';
import Title from './Title.jsx';
import Button from './Button.jsx';

export default function Form({
  title,
  children,
  onSubmit,
  submitLabel = 'Enviar',
  ...props
}) {
  return <View {...props}>
    {title && <Title>{title}</Title>}
    {children}
    {onSubmit && <Button onPress={onSubmit} label={submitLabel} />}
  </View>;
}