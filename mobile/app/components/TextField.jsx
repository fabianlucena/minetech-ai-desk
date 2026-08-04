import { TextInput } from 'react-native';
import Field from './Field';

export default function TextField({
  label,
  style,
  fieldStyle,
  labelStyle,
  ...props
}) {
  style = {
    borderColor: '#ccc',
    placeholderTextColor: '#888',
    backgroundColor: '#fff',
    fontSize: 16,
    borderRadius: 4,
    paddingHorizontal: 6,
    ...style,
  };

  labelStyle = {
    paddingHorizontal: 6,
    ...labelStyle
  }
  
  return <Field
    label={label}
    style={fieldStyle}
    labelStyle={labelStyle}
  >
    <TextInput
      style={style}
      {...props}
    />
  </Field>;
}
