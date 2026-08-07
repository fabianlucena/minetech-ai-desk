import Icon from '@react-native-vector-icons/material-icons';

export default function MessageStatusIcon({
  size = 16,
  color = '#888',
  sentAt,
  deliveredAt,
  readAt,
  failedAt,
}) {
  let name = 'access-time';

  if (failedAt) {
    name = 'error-outline';
    color = '#d00';
  }

  if (readAt) {
    name = 'done-all';
    color = '#5bf';
  }

  if (deliveredAt) {
    name = 'done-all';
  }

  if (sentAt) {
    name = 'done';
  }

  return <Icon
    name={name}
    size={size}
    color={color}
  />;
}