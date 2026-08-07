import { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { error } from '../components/Toast';
import ConversationItem from '../components/ConversationItem';
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
      renderItem={({ item }) => <ConversationItem conversation={item} />}
    />
  </View>;
}