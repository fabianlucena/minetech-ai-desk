import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Pressable, Text } from 'react-native';

export default function CustomDrawer({
  buttons,
  fontSize = 14,
  ...props
}) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />

      {buttons && buttons.map((button, index) => (
        <Pressable
          key={index}
          style={{
            padding: 8,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 18,
          }}
          onPress={button.onPress}
        >
          {button.icon?.({ size: ((button.fontSize || fontSize) * 1.5), color: button.color || color || 'black' })}
          <Text
            style={{
              fontSize: (button.fontSize || fontSize),
              color: button.color || color || 'black',
              marginHorizontal: 12,
            }}
          >
            {button.label}
          </Text>
        </Pressable>
      ))}
    </DrawerContentScrollView>
  );
}
