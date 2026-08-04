import { Pressable, Text } from 'react-native';

export default function Button({
  label,
  onPress,
  style,
  labelStyle,
  disabled,
  ...props
}) {
  style = {
    backgroundColor: disabled ? '#ccc' : '#D8B128',
    padding: 10,
    marginHorizontal: 8,
    borderRadius: 4,
    alignItems: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    ...style,
  };

  labelStyle = {
    color: style.color,
    fontSize: style.fontSize,
    fontWeight: 'bold',
    ...labelStyle,
  }

  return <Pressable
    style={style}
    onPress={onPress}
    disabled={disabled}
    {...props}
  >
    <Text style={labelStyle}>{label}</Text>
  </Pressable>;
}