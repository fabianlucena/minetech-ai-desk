import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return <View>
    <Text>Inicio</Text>
    <Button title="Login" onPress={() => navigation.navigate('login')} />
  </View>;
}
