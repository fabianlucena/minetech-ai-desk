import MIIcon from '@react-native-vector-icons/material-icons';
import globalStyles from '../global-styles';

export default function Icon({
  name,
  size,
  color,
  style,
}) {
  return <MIIcon
    name={name}
    size={size || globalStyles.icon.size}
    color={color || globalStyles.icon.color}
    style={{...globalStyles.icon, ...style}}
  />;
}