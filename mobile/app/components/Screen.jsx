import { SafeAreaView } from 'react-native-safe-area-context';
import globalStyles from '../global-styles';

export default function Screen({
  children,
  style,
  edges = ['left', 'right', 'bottom'],
  ...props
}) {
  style = {
    ...globalStyles,
    ...globalStyles.screen,
    flex: 1,
    padding: 10,
    ...style,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  };

  return <SafeAreaView
    style={style}
    edges={edges}
    {...props}
  >
    {children}
  </SafeAreaView>;
}