import { useRoute } from '@react-navigation/native';
import { View, Text } from 'react-native';

export default function ConversationMessages() {
  const route = useRoute();
  
  return <View>
    <Text>Mensajes de la Conversación</Text>
    <Text>UUID de la Conversación: {route.params?.conversationUuid}</Text>
  </View>;
}
