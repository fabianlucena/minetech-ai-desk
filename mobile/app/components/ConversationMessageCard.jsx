import { View, Text } from 'react-native';
import MessageStatusIcon from './MessageStatusIcon';
import { formatTime } from '../utils/datetime';
import globalStyles from '../global-styles';
import { formatRelativeDate } from '../utils/datetime';

export default function ConversationCard({
  message
}) {
  const style = {
    ...globalStyles.conversation.message.card,
    ...message.isMine ? globalStyles.conversation.message.card.mine : {},
  };

  if (message.type === 'dateSeparator') {
    return <View
      style={{
        ...style,
        alignSelf: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
      }}
    >
      <Text
        style={{
          color: '#888',
          fontSize: 12,
          fontWeight: 'bold',
        }}
      >
        {formatRelativeDate(message.timestamp)}
      </Text>
    </View>;
  }

  return <View
    style={style}
  >
    <Text style={globalStyles.conversation.message.card.text} >
      {message.text}
    </Text>
    <View
      style={{
        ...globalStyles.conversation.message.card.time.container,
        width: '100%',
        height: 'auto',
        flex: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'end',
      }}
    >
      <Text
        style={globalStyles.conversation.message.card.time}
      >
        {formatTime(message.receivedAt)}
      </Text>
      <MessageStatusIcon
        sentAt={message.sentAt}
        deliveredAt={message.deliveredAt}
        readAt={message.readAt}
        failedAt={message.failedAt}
      />
    </View>
  </View>;
}