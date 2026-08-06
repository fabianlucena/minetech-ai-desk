import { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { error } from '../components/Toast';
import useConversation from '../services/useConversation';

export default function ConversationsScreen() {
  const { getConversations } = useConversation();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    getConversations()
      .then(setConversations)
      .catch(err => error('Error al cargar las conversaciones:', err));
  }, []);

  return <View>
    <Text>Pantalla de Conversaciones</Text>
    <FlatList
      data={conversations}
      keyExtractor={(item) => item.uuid}
      renderItem={({ item }) => <Text>{item.lastMessageAt.toString()}</Text>}
    />
  </View>;
}
