import { ActivityIndicator as RNActivityIndicator} from 'react-native';
import globalStyles from '../global-styles';

export default function ActivityIndicator({
  size,
  color,
}) {
  return <RNActivityIndicator
    size={size || globalStyles.activityIndicator.size}
    color={color || globalStyles.activityIndicator.color}
  />;
}