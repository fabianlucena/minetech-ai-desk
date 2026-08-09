import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from './Icon';
import globalStyles from '../global-styles';

export default function ConversationCard({
  conversation
}) {
  const navigation = useNavigation();

  const style = {
    ...globalStyles,
    ...globalStyles.card,
    ...globalStyles.conversation.card,
  };

  const textStyle = {
    color: style.color,
  };

  const phoneStyle = {
    ...textStyle,
    ...globalStyles.conversation.card.phone,
  };

  const iconStyle = {
    ...textStyle,
    ...globalStyles.conversation.card.icon,
  };

  return <Pressable
    style={style}
    onPress={() => navigation.navigate('messages', { conversationUuid: conversation.uuid })}
  >
    <View>
      <Text style={textStyle}>{conversation.requester.displayName}</Text>
      <Text style={phoneStyle}>{conversation.requester.phone}</Text>
    </View>
    <Icon
      name="forum"
      style={iconStyle}
    />
  </Pressable>;
}