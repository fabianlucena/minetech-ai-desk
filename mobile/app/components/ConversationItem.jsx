import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from './Icon';
import globalStyles from '../global-styles';

export default function ConversationItem({
  conversation
}) {
  const navigation = useNavigation();

  return <Pressable
    style={globalStyles.conversation.item}
    onPress={() => navigation.navigate('messages', { conversationUuid: conversation.uuid })}
  >
    <View>
      <Text>{conversation.requester.displayName}</Text>
      <Text>{conversation.requester.phone}</Text>
    </View>
    <Icon name="forum" />
  </Pressable>;
}