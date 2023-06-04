# Sesión 15 - Swagger y desplegar en Render

# VIDEO 01 - Intro a Swagger

Swagger es una suite de herramientas de código abierto que ayudan a desarrolladores a diseñar, construir, documentar y consumir servicios web RESTful. Estas herramientas incluyen el soporte para la documentación de API, pruebas de interfaz de usuario, pruebas de generación de código, etc.

La especificación Swagger, también conocida como OpenAPI, es un lenguaje de descripción de API que permite a los equipos de desarrollo describir las interfaces de sus servicios web de manera que las máquinas las puedan entender. Una vez que una API está descrita en Swagger, hay una serie de herramientas que pueden trabajar con esta descripción.

Aquí hay algunas formas en las que Swagger puede ser útil:

1. **Diseño y documentación de API**: Swagger te permite describir todas las operaciones que tu API puede realizar, incluyendo los detalles como los puntos de acceso, parámetros de entrada, respuestas esperadas, etc. Esta documentación puede ser utilizada por los desarrolladores que necesitan usar tu API.
2. **Generación de código**: Swagger puede generar automáticamente código para varias plataformas y lenguajes a partir de su descripción de la API. Esto puede ayudar a acelerar el proceso de desarrollo y asegurar que la implementación de la API esté sincronizada con su documentación.
3. **Pruebas y depuración**: Swagger también proporciona herramientas para probar y depurar tu API. Puedes realizar llamadas a la API directamente desde la documentación y ver las respuestas en tiempo real.
4. **Interoperabilidad**: Dado que Swagger es una especificación estándar para las APIs, puede ayudar a asegurar la interoperabilidad entre diferentes servicios web. Esto puede ser particularmente útil en arquitecturas de microservicios, donde diferentes servicios necesitan comunicarse entre sí.

Para instalar swagger en nuestro proyecto hemos instalado con NPM las siguientes librerías:

```tsx
npm i swagger-jsdoc
npm i swagger-ui-express
npm i @types/swagger-jsdoc
npm i @types/swagger-ui-express
```

Después hemos desactivado todo lo relacionado con SQL ya que db4free va demasiado lento.

Tras esto hemos indicado en nuestro index.ts que express debe levantar un server de Swagger en /api-docs:

```tsx
// Swagger
  const specs = swaggerJsDoc(swaggerOptions);
  app.use(
    "/api-docs",
    swaggerUiExpress.serve,
    swaggerUiExpress.setup(specs)
  );
```

Para ellos también ha sido necesario crear el fichero swagger-options.ts:

```tsx
import { type SwaggerOptions } from "swagger-ui-express";

export const swaggerOptions: SwaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node S15",
      version: "1.0.0",
      description: "This is a simple CRUD API",
      license: {
        name: "MIT",
        url: "http://mit.com",
      },
      contact: {
        name: "Fran Linde",
        url: "https://github.com/franlidebl",
        email: "fran@example.com"
      }
    },
    server: [
      {
        url: "http://localhost:3000"
      }
    ]
  },
  apis: [
    "./src/models/*/*.ts",
    "./src/routes/*/*.ts",
  ]
};
```

