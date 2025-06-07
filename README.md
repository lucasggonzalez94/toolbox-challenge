# Toolbox - Configuración Docker

Este repositorio contiene la configuración Docker para ejecutar tanto el backend como el frontend de la aplicación Toolbox.

## Requisitos

- Docker
- Docker Compose

## Estructura del Proyecto

- `toolbox-be`: API backend en Node.js 14
- `toolbox-fe`: Aplicación frontend en React con Node.js 16

## Instrucciones de Uso

### Iniciar los servicios

Para iniciar tanto el backend como el frontend con Docker Compose:

```bash
docker-compose up
```

Para ejecutar en segundo plano:

```bash
docker-compose up -d
```

### Acceder a las aplicaciones

- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173

### Detener los servicios

```bash
docker-compose down
```

## Detalles de la Configuración

- **Backend**: Ejecuta Node.js 14 en el puerto 3000
- **Frontend**: Ejecuta Node.js 16 con Vite en el puerto 5173
- Los contenedores están conectados a través de una red Docker llamada `toolbox-network`
- Los volúmenes están configurados para permitir el desarrollo en tiempo real (los cambios en el código se reflejan automáticamente)
