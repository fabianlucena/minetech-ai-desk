import { useState, useEffect, useCallback, useRef } from 'react';
import { useRoute } from '@react-navigation/native';
import { error, warning } from '../components/Toast';
import useConversationMessages from '../services/useConversationMessage';
import { View, FlatList, TextInput } from 'react-native';
import Icon from '../components/Icon';
import ConversationMessageCard from '../components/ConversationMessageCard';
import useApi from '../services/useApi';

export default function ConversationMessagesScreen() {
  const route = useRoute();
  const conversationUuid = route.params?.conversationUuid;
  const { getConversationMessages } = useConversationMessages();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const flatListRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const { iaDeskSocket } = useApi();

  const fetchMessages = useCallback(async () => {
    if (!conversationUuid)
      return;

    try {
      const msgs = await getConversationMessages(conversationUuid);
      const messages = msgs
        .map(msg => ({
          ...msg,
          isMine: msg.senderType !== 'requester',
        }))
        .sort((a, b) => a.receivedAt.getTime() - b.receivedAt.getTime());
            
      let lastDate = null;
      for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        const msgDate = msg.receivedAt.toDateString();
        if (msgDate !== lastDate) {
          lastDate = msgDate;
          messages.splice(i, 0, { type: 'dateSeparator', timestamp: msg.receivedAt });
          i++;
        }
      }

      setMessages(messages);
    } catch (err) {
      console.error('Error fetching conversation messages:', err);
      error('Error al cargar los mensajes de la conversación:', err);
    }
  }, [conversationUuid, getConversationMessages]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  function addMessage(message) {
    if (typeof message === 'string') {
      message = {
        isMine: true,
        text: message,
      };
    }

    message.uuid ||= `temp-${Date.now()}`;
    message.receivedAt ||= new Date();

    const messagesToAdd = [message];
    let lastDate = messages.length > 0 ? messages[messages.length - 1].receivedAt.toDateString() : null;
    const msgDate = message.receivedAt.toDateString();
    if (msgDate !== lastDate) {
      lastDate = msgDate;
      messagesToAdd.splice(0, 0, { type: 'dateSeparator', timestamp: message.receivedAt });
    }

    setMessages(prevMessages => [...prevMessages, ...messagesToAdd]);
  }

  function handleSubmit() {
    warning('Falta lógica para enviar mensaje', message);
    addMessage(message);
    setMessage('');
    iaDeskSocket.send(JSON.stringify({
      type: 'send_message',
      conversationUuid,
      text: message,
    }));
  }

  function handleScroll(e) {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;

    const paddingToBottom = 20; // margen de tolerancia
    const isBottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - paddingToBottom;

    setIsAtBottom(isBottom);
  }

  function handleContentSizeChange() {
    if (isAtBottom && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }

  function scrollToBottom() {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 1500);
    }
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
      ref={flatListRef}
      onLayout={scrollToBottom}
      data={messages}
      keyExtractor={(item) => item.uuid || item.timestamp.toString()}
      renderItem={({ item }) => <ConversationMessageCard message={item} />}
      onScroll={handleScroll}
      onContentSizeChange={handleContentSizeChange}
      scrollEventThrottle={16}
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
        onPress={handleSubmit}
      />
    </View>
  </View>;
}
