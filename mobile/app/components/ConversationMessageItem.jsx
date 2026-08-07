import { View, Text } from 'react-native';
import MessageStatusIcon from './MessageStatusIcon';
import { formatTime } from '../utils/datetime';

export default function ConversationItem({
  message
}) {
  const style = {
    padding: 10,
    borderRadius: 8,
    margin: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
  };

  if (message.isMine) {
    style.alignSelf = 'flex-end';
    style.backgroundColor = '#143';
  } else {
    style.alignSelf = 'flex-start';
    style.backgroundColor = '#2a2a2a';
  }

  return <View
    style={style}
  >
    <Text
      style={{
        color: '#fff',
        fontSize: 14,
      }}
    >
      {message.text}
    </Text>
    <View
      style={{
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'end',
        gap: 5,
      }}
    >
      <Text
        style={{
          color: '#aaa',
          fontSize: 13,
        }}
      >
        {formatTime(message.receivedAt)}
      </Text>
      <MessageStatusIcon
        size={14}
        color="#888"
        sentAt={message.sentAt}
        deliveredAt={message.deliveredAt}
        readAt={message.readAt}
        failedAt={message.failedAt}
      />
    </View>
  </View>;
}