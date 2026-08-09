import { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { error } from '../components/Toast';
import Screen from '../components/Screen';
import ConversationItem from '../components/ConversationCard';
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

  return <Screen>
    <Title>Pantalla de Conversaciones</Title>
    <FlatList
      data={conversations}
      keyExtractor={(item) => item.uuid}
      renderItem={({ item }) => <ConversationItem conversation={item} />}
    />
  </Screen>;
}