import { useState, useEffect, useCallback, useRef } from 'react';
import { useRoute } from '@react-navigation/native';
import { error } from '../components/Toast';
import useConversationMessages from '../services/useConversationMessage';
import { View, FlatList, TextInput } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useHeaderHeight } from '@react-navigation/elements';
import Icon from '../components/Icon';
import ConversationMessageCard from '../components/ConversationMessageCard';
import uuid from 'react-native-uuid';
import Screen from '../components/Screen.jsx';

function normalizeMessageToShow(msg) {
  msg.id ??= msg.uuid;
  msg.timestamp ??= msg.receivedAt;
  msg.message ??= msg.text;
  msg.isMine ??= msg.senderType !== 'requester';

  return msg;
}

export default function ConversationMessagesScreen() {
  const headerHeight = useHeaderHeight();
  const route = useRoute();
  const conversationUuid = route.params?.conversationUuid;
  const { getConversationMessages, normalizeConversationMessage, connectToChat } = useConversationMessages();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const flatListRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const ws = useRef(null);
  const wsTimeout = useRef(1500);

  const normalizeMessage = useCallback((msg) => {
    const normalizedMsg = normalizeConversationMessage(msg);
    normalizedMsg.isMine = normalizedMsg.senderType !== 'requester';
    return normalizedMsg;
  }, [normalizeConversationMessage]);

  const connect = useCallback(() => {
    console.log('Connecting to chat...');

    if (ws.current)
      return;
    
    const newWs = connectToChat(conversationUuid, (msg) => {
      if (msg.type === 'chat_message') {
        const message = normalizeConversationMessage(msg.message);
        setMessages(messages => {
          const exists = messages.some(m => m.uuid === message.uuid);
          if (exists) {
            return messages.map(m =>
              m.uuid === message.uuid
                ? {
                    ...m,
                    ...message,
                  }
                : m
            );
          }

          return [
            ...messages,
            normalizeMessageToShow(message),
          ].sort((a, b) => a.timestamp - b.timestamp);
        });
      } else if (msg.type === 'error') {
        error(`Error del servidor: ${msg.message}`);
      }
    });

    newWs.ref = uuid.v4();
    newWs.onclose = () => {
      console.log('WebSocket connection closed.');

      if (ws.current && ws.current.ref === newWs.ref)
        ws.current = null;

      if (wsTimeout.current) {
        console.log('Reconnecting...');
        setTimeout(connect, wsTimeout.current);
      }
    };

    ws.current = newWs;
  }, [conversationUuid, connectToChat, normalizeConversationMessage]);

  useEffect(() => {
    wsTimeout.current = 1500;
    connect();
    
    return () => {
      wsTimeout.current = 0;
      if (!ws.current)
        return;

      if (ws.current.readyState === WebSocket.CONNECTING) {
        ws.current.onopen = () => ws.current.close(1000, 'Conexión cerrada por el cliente');
      }

      if (ws.current.readyState === WebSocket.OPEN) {
        ws.current.close(1000, 'Conexión cerrada por el cliente');
      }
    }
  }, [uuid, connectToChat, normalizeConversationMessage]);

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
      console.log('Error fetching conversation messages:', err);
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
    if (!ws.current) {
      error('No hay conexión con el servidor. Intenta de nuevo más tarde.');
      return;
    }

    try {
      const data = {
        uuid: uuid.v4(),
        isMine: true,
        text: message,
        receivedAt: new Date(),
      };
      addMessage(data);
      setMessage('');

      ws.current.send(JSON.stringify({
        type: 'send_message',
        uuid: data.uuid,
        conversationUuid,
        text: message,
      }));
    } catch (err) {
      console.error('Error sending message:', err);
      error('Error al enviar el mensaje:', err);
    }
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

  return <Screen
    style={{
      padding: 0,
      justifyContent: 'end',
      alignItems: 'normal',
    }}
  >
    <KeyboardAvoidingView
      behavior={'padding'}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'stretch',
      backgroundColor: '#141414',
      }}
      keyboardVerticalOffset={headerHeight}
    >
      <FlatList
        ref={flatListRef}
        onLayout={scrollToBottom}
        data={messages}
        keyExtractor={(item) => item.uuid}
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
    </KeyboardAvoidingView>
  </Screen>;
}
