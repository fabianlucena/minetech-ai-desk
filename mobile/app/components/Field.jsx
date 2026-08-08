import { Text, View } from 'react-native';
import globalStyles from '../global-styles';

export default function TextField({
  label,
  required,
  children,
  style,
  labelStyle,
  ...props
}) {
  style = {
    ...globalStyles.field,
    ...style,
  };

  labelStyle = {
    ...globalStyles.field.label,
    ...labelStyle
  };
  
  return <View style={style} >
    <View style={{ flexDirection: "row" }}>
      {required && <Text style={globalStyles.field.required}>*</Text>}
      {label && <Text style={labelStyle} {...props}>{label}</Text>}
    </View>
    {children}
  </View>;
}
