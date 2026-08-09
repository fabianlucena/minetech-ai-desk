import { useState, useEffect, useCallback, useRef } from 'react';
import { useRoute } from '@react-navigation/native';
import { error } from '../components/Toast';
import useConversationMessages from '../services/useConversationMessage';
import { View, FlatList, TextInput } from 'react-native';
import Icon from '../components/Icon';
import ConversationMessageCard from '../components/ConversationMessageCard';
import useApi from '../services/useApi';
import uuid from 'react-native-uuid';

export default function ConversationMessagesScreen() {
  const route = useRoute();
  const conversationUuid = route.params?.conversationUuid;
  const { getConversationMessages, normalizeConversationMessage } = useConversationMessages();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const flatListRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const { iaDeskSocket, addSocketHandler, removeSocketHandler } = useApi();

  const normalizeMessage = useCallback((msg) => {
    const normalizedMsg = normalizeConversationMessage(msg);
    normalizedMsg.isMine = normalizedMsg.senderType !== 'requester';
    return normalizedMsg;
  }, [normalizeConversationMessage]);

  const iaDeskSocketHandler = useCallback((msg) => {
    if (msg.message.conversation.uuid !== conversationUuid || msg.type !== 'send_message' && msg.type !== 'send_message_success' )
      return;

    setMessages(prevMessages => {
      if (msg.ref && prevMessages.some(m => m.ref === msg.ref)) {
        return prevMessages.map(m => m.ref === msg.ref ? { ...m, ...normalizeMessage(msg.message) } : m);
      }

      if (prevMessages.some(m => m.uuid === msg.message.uuid)) {
        return prevMessages.map(m => m.uuid === msg.message.uuid ? { ...m, ...normalizeMessage(msg.message) } : m);
      }
  
      return [...prevMessages, normalizeMessage(msg.message)];
    });
  }, [conversationUuid]);

  useEffect(() => {
    addSocketHandler(iaDeskSocketHandler);
    return () => removeSocketHandler(iaDeskSocketHandler);
  }, [iaDeskSocketHandler]);

  const fetchMessages = useCallback(async () => {
    if (!conversationUuid)
      return;

    try {
      const msgs = await getConversationMessages(conversationUuid);
      const messages = msgs
        .map(normalizeMessage)
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
      scrollToBottom();
    } catch (err) {
      console.error('Error fetching conversation messages:', err);
      error('Error al cargar los mensajes de la conversación:', err);
    }
  }, [conversationUuid, getConversationMessages]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  function addMessage(message) {
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
    const data = {
      ref: uuid.v4(),
      isMine: true,
      text: message,
      receivedAt: new Date(),
    };
    addMessage(data);
    setMessage('');
    iaDeskSocket.send(JSON.stringify({
      type: 'send_message',
      ref: data.ref,
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
      }, 150);
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
      keyExtractor={(item) => item.ref || item.uuid || item.timestamp.toString()}
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
