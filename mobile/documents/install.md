# Crear proyecto

```bash
npx create-expo-app mobile --template blank

npx expo install @react-navigation/native
npx expo install react-native-screens react-native-safe-area-context
npx expo install react-native-gesture-handler react-native-reanimated
npx expo install @react-navigation/drawer
npx expo install @react-native-async-storage/async-storage
```

## Ejecutar proyecto

usa Expo Go para ejecutar la app.

```bash
npx expo start
```

## Otros paquetes

```bash
npx expo install @react-navigation/native-stack
npx expo install @react-navigation/bottom-tabs
```

## Para correr en navegadores web

```bash
npx expo install react-dom react-native-web @expo/metro-runtime
```

# Para correr en moviles

El móvil debe estar conectado por ADB

```bash
npm run android
```

# Para inicar

```bash
npm start
```

# Para notificaciones

```bash
npx expo install react-native-toast-message
```
