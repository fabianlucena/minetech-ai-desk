import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@react-native-vector-icons/material-icons';

export default function ConversationItem({
  conversation
}) {
  const navigation = useNavigation();

  return <Pressable
    style={{
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      margin: 10,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
    onPress={() => navigation.navigate('messages', { conversationUuid: conversation.uuid })}
  >
    <View>
      <Text>{conversation.requester.displayName}</Text>
      <Text>{conversation.requester.phone}</Text>
    </View>
    <Icon
      name="forum"
      size={24}
      color="#888"
    />
  </Pressable>;
}