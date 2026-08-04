import Screen from '../components/Screen.jsx';
import Title from '../components/Title.jsx';
import { ActivityIndicator } from "react-native";

export default function InitiatingScreen() {
  return <Screen>
    <Title>Iniciando aplicación</Title>
    <ActivityIndicator size="large" color="#F4C300" />
  </Screen>;
}
