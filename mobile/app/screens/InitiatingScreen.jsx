import Screen from '../components/Screen.jsx';
import Title from '../components/Title.jsx';
import ActivityIndicator from '../components/ActivityIndicator';

export default function InitiatingScreen() {
  return <Screen edges={['top', 'left', 'right', 'bottom']}>
    <Title>Iniciando aplicación</Title>
    <ActivityIndicator />
  </Screen>;
}
