import { useState, useEffect, useCallback } from 'react';
import { useRoute } from '@react-navigation/native';
import { error, warning } from '../components/Toast';
import useConversationMessages from '../services/useConversationMessage';
import { View, FlatList, TextInput } from 'react-native';
import Icon from '@react-native-vector-icons/material-icons';
import ConversationMessageItem from '../components/ConversationMessageItem';

export default function ConversationMessagesScreen() {
  const route = useRoute();
  const conversationUuid = route.params?.conversationUuid;
  const { getConversationMessages } = useConversationMessages();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const fetchMessages = useCallback(async () => {
    if (!conversationUuid)
      return;

    try {
      const msgs = await getConversationMessages(conversationUuid);
      setMessages(msgs
        .map(msg => ({
          ...msg,
          isMine: msg.senderType !== 'requester',
        }))
        .sort((a, b) => a.timestamp - b.timestamp)
      );
    } catch (err) {
      error('Error al cargar los mensajes de la conversación:', err);
    }
  }, [conversationUuid, getConversationMessages]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  function handleSubmit() {
    warning('Falta lógica para enviar mensaje', message);
    setMessage('');
  }

  return <View
    style={{
      flex: 1,
      justifyContent: 'end',
      alignItems: 'normal',
      backgroundColor: '#141414',
    }}
  >
    <FlatList
      data={messages}
      keyExtractor={(item) => item.uuid}
      renderItem={({ item }) => <ConversationMessageItem message={item} />}
    />
    <View
      style={{
        padding: 10,
        backgroundColor: '#333',
        borderRadius: 8,
        margin: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <TextInput
        style={{
          color: '#fff',
          flex: 1,
        }}
        value={message}
        onChangeText={(value) => setMessage(value)}
        onSubmitEditing={handleSubmit}
      />
      <Icon
        name="send"
        size={18}
        color="#888"
        onPress={handleSubmit}
      />
    </View>
  </View>;
}
