import { Text, TextInput, View } from 'react-native';

export default function TextField({
  label,
  navigation,
  style,
  ...props
}) {
  style = {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
    ...style,
  };
  
  return <View>
    {label && <Text>{label}</Text>}
    <TextInput
      style={style}
      {...props}
    />
  </View>;
}
