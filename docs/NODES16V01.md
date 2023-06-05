# VIDEO 01 - Intro a jest y supertest

`Jest` y `Supertest` son dos librerías muy utilizadas en el desarrollo de APIs con Node.js, especialmente en el contexto de las pruebas.

**Jest** es un marco de pruebas desarrollado por Facebook que se utiliza para escribir pruebas de unidades y de integración. Es conocido por su facilidad de configuración y por su capacidad para generar informes de cobertura de pruebas. Con Jest, puedes escribir pruebas que verifiquen que tu lógica de negocio se comporta como se espera.

Este sería un ejemplo de una prueba con Jest:

```jsx
test('suma 1 + 2 es igual a 3', () => {
  expect(1 + 2).toBe(3);
});
```

**Supertest** es una librería que se utiliza para escribir pruebas de extremo a extremo, es decir, pruebas que hacen solicitudes HTTP a tu API y verifican las respuestas. Es especialmente útil para probar cómo tu aplicación se comporta ante diferentes tipos de solicitudes HTTP.

Este sería un ejemplo de una prueba con Supertest:

```jsx
const request = require('supertest');
const app = require('../app');

test('GET / devuelve un código de estado 200', async () => {
  await request(app)
    .get('/')
    .expect(200);
});
```

Por lo tanto, Jest y Supertest son herramientas complementarias que puedes usar para garantizar que tu API se comporta correctamente, tanto a nivel de la lógica de negocio como a nivel de la interacción HTTP.

Al utilizar ambas librerías en tu proceso de desarrollo, podrás incrementar la calidad y fiabilidad de tu código, prevenir bugs y mejorar la mantenibilidad de tu API.

En este vídeo hemos instalado las librerías necesarias para hacer testing en nuestra API:

```tsx
npm i jest
npm i @types/jest
npm i supertest
npm i @types/supertest
npm i ts-jest
```

Hemos creado el fichero de config de Jest (jest.config.js):

```tsx
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
};
```

Y hemos creado nuestro primer test, que solo comprueba datos obvios pero nos sirve para probar nuestra arquitectura de tests:

```tsx
import { describe } from "node:test";
import { mongoConnect } from "../src/databases/mongo-db";
import mongoose from "mongoose";

describe("User controller", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("Simple test to check jest in working", () => {
    expect(true).toBeTruthy();
  });

  it("Simple test to check jest in working", () => {
    const miTexto = "Hola chicos";
    expect(miTexto.length).toBe(11);
  });
});
```

Hemos modificado el tsconfig.json para que también aplique en las carpetas de tests:

```tsx
"include": ["src/**/*.ts", "__tests__/**/*.ts", "__tests__/*.ts"],
"exclude": ["dist/*"]
```
