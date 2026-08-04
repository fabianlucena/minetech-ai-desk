import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Pressable, Text } from 'react-native';

export default function CustomDrawer({
  buttons,
  ...props
}) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />

      {buttons && buttons.map((button, index) => (
        <Pressable
          key={index}
          style={{ padding: 16 }}
          onPress={button.onPress}
        >
          <Text style={{ fontSize: 16, color: button.color || 'black' }}>
            {button.label}
          </Text>
        </Pressable>
      ))}
    </DrawerContentScrollView>
  );
}
