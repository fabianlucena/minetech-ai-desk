import { TextInput } from 'react-native';
import Field from './Field';
import { useForm } from './FormContext';
import globalStyles from '../global-styles';

export default function TextField({
  label,
  required,
  style,
  fieldStyle,
  labelStyle,
  ...props
}) {
  const { onSubmit } = useForm();

  style = {
    color: globalStyles.field.color,
    fontSize: globalStyles.field.fontSize,
    ...globalStyles.textField,
    placeholder: globalStyles.placeholder,
    ...style,
  };

  labelStyle = {
    ...globalStyles.label,
    ...labelStyle
  }
  
  return <Field
    label={label}
    required={required}
    style={fieldStyle}
    labelStyle={labelStyle}
  >
    <TextInput
      style={style}
      onSubmitEditing={onSubmit}
      {...props}
    />
  </Field>;
}
