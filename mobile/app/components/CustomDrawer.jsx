import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Pressable, Text } from 'react-native';

export default function CustomDrawer({
  buttons,
  fontSize = 14,
  ...props
}) {
  const filteredRoutes = props.state.routes.filter(route => {
    let showMenu = props.descriptors[route.key]?.options?.showMenu;
    if (typeof showMenu === 'function')
      showMenu = !!showMenu();

    return showMenu ?? true;
  });

  const oldFocusedKey = props.state.routes[props.state.index]?.key;
  let newIndex = filteredRoutes.findIndex(r => r.key === oldFocusedKey);
  if (newIndex === -1)
    newIndex = 0;

  const filteredState = {
    ...props.state,
    routes: filteredRoutes,
    index: newIndex,
  };
  
  return <DrawerContentScrollView {...props}>
    <DrawerItemList
      {...props}
      state={filteredState}
    />

    {buttons && buttons.filter(Boolean).map((button, index) => (
      <Pressable
        key={index}
        style={{
          padding: 8,
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 18,
        }}
        onPress={(...params) => {
          props.navigation.closeDrawer();
          button.onPress?.(...params);
        }}
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
  </DrawerContentScrollView>;
}
