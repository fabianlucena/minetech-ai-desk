import { Pressable, Text } from 'react-native';
import globalStyles from '../global-styles';

export default function Button({
  label,
  onPress,
  style,
  labelStyle,
  disabled,
  children,
  ...props
}) {
  style = {
    ...globalStyles.button,
    ...disabled ? globalStyles.button.disabled : {},
    ...style,
  };

  labelStyle = {
    color: style.color,
    fontSize: style.fontSize,
    ...globalStyles.button.label,
    ...labelStyle,
  }

  return <Pressable
    style={style}
    onPress={onPress}
    disabled={disabled}
    {...props}
  >
    {label && <Text style={labelStyle}>{label}</Text>}
    {children}
  </Pressable>;
}