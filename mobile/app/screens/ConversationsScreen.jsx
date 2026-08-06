import { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { error } from '../components/Toast';
import Title from '../components/Title';
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
    <Title>Pantalla de Conversaciones</Title>
    <FlatList
      data={conversations}
      keyExtractor={(item) => item.uuid}
      renderItem={({ item }) => <View
        style={{
          padding: 10,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          margin: 10,
        }}>
          <Text>{item.requester.displayName}</Text>
          <Text>{item.requester.phone}</Text>
        </View>}
    />
  </View>;
}
