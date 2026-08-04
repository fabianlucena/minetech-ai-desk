import Screen from '../components/Screen.jsx';
import Title from '../components/Title.jsx';
import Button from '../components/Button.jsx';

export default function HomeScreen({ navigation }) {
  return <Screen>
    <Title>Inicio</Title>
    <Button label="Login" onPress={() => navigation.navigate('login')} />
  </Screen>;
}
