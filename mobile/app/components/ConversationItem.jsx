import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from './Icon';
import globalStyles from '../global-styles';

export default function ConversationItem({
  conversation
}) {
  const navigation = useNavigation();

  const style = {
    ...globalStyles,
    ...globalStyles.item,
    ...globalStyles.conversation.item,
  };

  const textStyle = {
    color: style.color,
  };

  const phoneStyle = {
    ...textStyle,
    ...globalStyles.conversation.item.phone,
  };

  const iconStyle = {
    ...textStyle,
    ...globalStyles.conversation.item.icon,
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