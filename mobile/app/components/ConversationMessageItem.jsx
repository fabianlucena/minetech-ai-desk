import { View, Text } from 'react-native';
import MessageStatusIcon from './MessageStatusIcon';
import { formatTime } from '../utils/datetime';
import globalStyles from '../global-styles';

export default function ConversationItem({
  message
}) {
  const style = {
    ...globalStyles.conversation.message.item,
    ...message.isMine ? globalStyles.conversation.message.item.mine : {},
  };

  return <View
    style={style}
  >
    <Text style={globalStyles.conversation.message.item.text} >
      {message.text}
    </Text>
    <View
      style={{
        ...globalStyles.conversation.message.item.time.container,
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'end',
      }}
    >
      <Text
        style={globalStyles.conversation.message.item.time}
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