# API REST de Procesamiento de Archivos

Esta API REST toma información de una API externa, la procesa y la expone en un formato estructurado.

## Requisitos

- Node.js 14 o superior
- npm

## Instalación

```bash
npm install
```

## Ejecución

Para iniciar el servidor:

```bash
npm start
```

El servidor se iniciará en el puerto 3000 por defecto. Puedes cambiar el puerto configurando la variable de entorno `PORT`.

## Pruebas

Para ejecutar las pruebas:

```bash
npm test
```

## Endpoints

### GET /files/data

Obtiene los datos procesados de todos los archivos disponibles.

**Ejemplo de respuesta:**

```json
[
  {
    "file": "file1.csv",
    "lines": [
      {
        "text": "RgTya",
        "number": 64075909,
        "hex": "70ad29aacf0b690b0467fe2b2767f765"
      },
      {
        "text": "AtjW",
        "number": 6,
        "hex": "d33a8ca5d36d3106219f66f939774cf5"
      }
    ]
  }
]
```

### GET /files/data?fileName=file1.csv

Obtiene los datos procesados de un archivo específico.

### GET /files/list

Obtiene la lista de archivos disponibles.

**Ejemplo de respuesta:**

```json
{
  "files": ["file1.csv", "file2.csv"]
}
```

## Docker

Para ejecutar la API en un contenedor Docker:

```bash
docker build -t api-files .
docker run -p 3000:3000 api-files
```

O usando Docker Compose:

```bash
docker-compose up
```
