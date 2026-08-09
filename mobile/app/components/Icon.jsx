import MIIcon from '@react-native-vector-icons/material-icons';
import globalStyles from '../global-styles';

export default function Icon({
  name,
  size,
  color,
  style = {},
  ...props
}) {
  return <MIIcon
    name={name}
    size={size || style.size || globalStyles.icon.size}
    style={{
      ...globalStyles.icon,
      ...style,
      color: color || style.color || globalStyles.icon.color,
      size: undefined,
    }}
    {...props}
  />;
}