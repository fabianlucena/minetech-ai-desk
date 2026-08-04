import { Text, View } from 'react-native';

export default function TextField({
  label,
  children,
  style,
  labelStyle,
  ...props
}) {
  style = {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 4,
    marginHorizontal: 8,
    marginBottom: 10,

    color: '#6b6b6b',
    fontSize: 12,
    
    ...style,
  };

  labelStyle = {
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    color: style.color,
    marginBottom: 3,
    ...labelStyle
  };
  
  return <View style={style} >
    {label && <Text style={labelStyle} {...props}>{label}</Text>}
    {children}
  </View>;
}
