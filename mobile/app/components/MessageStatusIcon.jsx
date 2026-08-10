import Icon from '@react-native-vector-icons/material-icons';
import globalStyles from '../global-styles';

export default function MessageStatusIcon({
  size = globalStyles.messageStatusIcon.size,
  color = globalStyles.messageStatusIcon.color,
  sentAt,
  deliveredAt,
  readAt,
  failedAt,
}) {
  let name = 'access-time';

  if (failedAt) {
    name = 'error-outline';
    color = '#d00';
  } else if (readAt) {
    name = 'done-all';
    color = '#5bf';
  } else if (deliveredAt) {
    name = 'done-all';
    color = '#888';
  } else if (sentAt) {
    name = 'done';
    color = '#888';
  }

  return <Icon
    name={name}
    size={size}
    color={color}
  />;
}