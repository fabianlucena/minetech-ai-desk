# Pasos para crear App Business API Meta

## Portafolio comercial

Para proder crear una App en Meta, se requiere de un portafolio comercial. Y para la creación del portafolio comercial se requiere de una cuenta personal de Facebook. Si no se dispone de un portafolio comercial siga los siguientes pasos

1. Ingresar a la página comercial: [Meta Business Suite](https://business.facebook.com)
2. Crear el portafolio comercial: ![image](./images/pasted_20260924-183908.png)

## Creación de la App Business API Meta

1. Ingresar a: [Facebook](https://www.facebook.com/) con la cuenta de la persona que administra la empresa
2. Ingresar a: [Facebook Developers](https://developers.facebook.com/apps)
3. Crear una App, usar el botón verde "Crear App":![image](./images/pasted_20260924-181542.png)
4. Colocar el nombre de la App y el emial del responsable: ![image](./images/pasted_20260924-182251.png)
5. Agregar el caso de uso para WhastApp:![image](./images/pasted_20260924-182749.png)
6. Conectar al portafolio comercial: ![image](./images/pasted_20260924-183118.png)
7. Normalmente no se requieren requisitos adicionales: ![image](./images/pasted_20260924-183156.png)
8. Y, finalmente, creamos la App: ![image](./images/pasted_20260924-183226.png)

## Creación de la App de prueba

La App de prueba permite realizar pruebas, cambios y corregir errores sin afectar el comprtamiento de la app.

1. Desde el menú de la App se crea la App de prueba: ![image](./images/pasted_20260924-184404.png)
2. Colocar el nombre de App de prueba: ![image](./images/pasted_20260924-184512.png)

## Obtención de la App Secret

1. Ir a la configuración básica de la App: ![image](./images/pasted_20260925-012147.png)

## Obtención del número y la API key

1. En el panel de administración de la App principal (no la App de prueba) accedemos a personalizar casos de uso:![image](./images/pasted_20260924-190111.png)
2. Acceder al **Paso 1. Pruébalo** y copiar los datos: Phone Number ID y Token de acceso para colocarlos en la configuración de la Aplicación: ![image](./images/pasted_20260924-190950.png)
3. Configurar los números destinatarios y enviar mensajes de prueba. Mientras las App esté en modo prueba se pueden enviar mensajes unicamente a estos destinatarios:![image](./images/pasted_20260924-191617.png)

## Configuración de Minetech IA Desk

Editar el archivo config.local.js y colocar los valores configurados:

El token de verificación es un código inventado, por ejemplo: `minetech-ai-desk-verify-token-Lk89W2jz7jqc` para registrar la aplicación Minetech IA Desk en la App de Meta, se utiliza una única vez.

```json
export default {
  ...
  whatsapp: {
    baseUrl: 'https://graph.facebook.com/v25.0',
    appId: '{Identificadoe de la App}',
    appSecret: '{Clave secreta de la App}',
    verifyToken: '{Token de verificación}',
    phoneNumber: '{Número de teléfono}',
    phoneId: '{Identificador del teléfono}',
    token: '{Token de acceso}',
    timeout: 1500,
  },
};
```

## Registrar Minetech IA Desk en Meta

1. Dirigirse a personalizar caso de uso: ![image](./images/pasted_20260924-190111.png)
2. Buscar en "**Paso 2: Configuración de producción**": ![image](./images/pasted_20260925-013711.png) Recuerde colocar el mismo token de verificación que el configurado en la App.
3. Se deberá recibir un mensaje que la configuración fue realizada.
