# Instalación del sistema

## Configuración del Server

Copiar el archivo **config.local.js.demo** en **config.local.js**

```bash
cp config.local.js.demo config.local.js
```

Editar el archivo escribiendo en la propiedad **dbConnectionString** la cadena de conexión a la base de datos.

Opcionalmente también se puede definir la propiedad **port** para cambiar el puerto del backend.

## Iniciar el Server

Para iniciar el server usar el comando **npm run dev**
