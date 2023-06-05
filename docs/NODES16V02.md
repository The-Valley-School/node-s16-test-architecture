# VIDEO 02 - Test del POST a user

En este vídeo hemos realizado el primer test completo de nuestra API, en este caso hemos creado un test que valida el POST de usuarios:

```tsx
import { describe } from "node:test";
import { mongoConnect } from "../src/databases/mongo-db";
import mongoose from "mongoose";
import { app, server } from "../src/index";
import { type IUser } from "../src/models/mongo/User";
import request from "supertest";

describe("User controller", () => {
  const userMock: IUser = {
    email: "fran@mail.com",
    password: "12345678",
    firstName: "Fran",
    lastName: "Linde",
    phone: "666555444",
    address: {
      street: "Calle Falsa",
      number: 123,
      city: "Madrid",
    },
  };

  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  it("Simple test to check jest in working", () => {
    expect(true).toBeTruthy();
  });

  it("Simple test to check jest in working", () => {
    const miTexto = "Hola chicos";
    expect(miTexto.length).toBe(11);
  });

  it("POST /user - this should create an user", async() => {
    const response = await request(app)
      .post("/user")
      .send(userMock)
      .set("Accept", "application/json")
      .expect(201);

    expect(response.body).toHaveProperty("_id");
    expect(response.body.email).toBe(userMock.email);
  })
});
```

Para no tener problemas a la hora de lanzar los test hemos modificado el jest.config.js para que solo ejecute los test que se encuentran en la carpeta __tests__ 

```tsx
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: [
    "**/__tests__/**/*.ts"
  ]
};
```

Y ha sido necesario exportar desde app el server y la app:

```tsx
import { userRouter } from "./routes/user.routes";
import { carRouter } from "./routes/car.routes";
import { brandRouter } from "./routes/brand.routes";
import { type Request, type Response, type NextFunction, type ErrorRequestHandler } from "express";
import express from "express";
import cors from "cors";
import { mongoConnect } from "./databases/mongo-db";
import { languagesRouter } from "./routes/languages.routes";
// import { AppDataSource } from "./databases/typeorm-datasource";
// import { sqlConnect } from "./databases/sql-db";
import { playerRouter } from "./routes/player.routes";
import { teamRouter } from "./routes/team.routes";
import { swaggerOptions } from "./swagger-options";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

// Conexión a la BBDD
// const mongoDatabase = await mongoConnect();
// const sqlDatabase = await sqlConnect();
// const datasource = await AppDataSource.initialize();

// Configuración del server
const PORT = 3000;
export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Swagger
const specs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Rutas
const router = express.Router();
router.get("/", (req: Request, res: Response) => {
  // res.send(`
  //   <h3>Esta es la RAIZ de nuestra API.</h3>
  //   <p>Estamos usando la BBDD Mongo de ${mongoDatabase?.connection?.name as string}</p>
  //   <p>Estamos usando la BBDD SQL ${sqlDatabase?.config?.database as string} del host ${sqlDatabase?.config?.host as string}</p>
  //   <p>Estamos usando TypeORM con la BBDD: ${datasource.options.database as string}</p>
  // `);
  res.send(`
    <h3>Esta es la RAIZ de nuestra API.</h3>
`);
});
router.get("*", (req: Request, res: Response) => {
  res.status(404).send("Lo sentimos :( No hemos encontrado la página solicitada.");
});

// Middlewares de aplicación, por ejemplo middleware de logs en consola
app.use((req: Request, res: Response, next: NextFunction) => {
  const date = new Date();
  console.log(`Petición de tipo ${req.method} a la url ${req.originalUrl} el ${date.toString()}`);
  next();
});

// Middlewares de aplicación, por ejemplo middleware de logs en consola
app.use(async (req: Request, res: Response, next: NextFunction) => {
  await mongoConnect();
  next();
});

// Usamos las rutas
app.use("/user", userRouter);
app.use("/car", carRouter);
app.use("/brand", brandRouter);
app.use("/languages", languagesRouter);
app.use("/player", playerRouter);
app.use("/team", teamRouter);
app.use("/public", express.static("public"));
app.use("/", router);

// Middleware de gestión de errores
app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  console.log("*** INICIO DE ERROR ***");
  console.log(`PETICIÓN FALLIDA: ${req.method} a la url ${req.originalUrl}`);
  console.log(err);
  console.log("*** FIN DE ERROR ***");

  // Truco para quitar el tipo a una variable
  const errorAsAny: any = err as unknown as any;

  if (err?.name === "ValidationError") {
    res.status(400).json(err);
  } else if (errorAsAny.errmsg && errorAsAny.errmsg?.indexOf("duplicate key") !== -1) {
    res.status(400).json({ error: errorAsAny.errmsg });
  } else if (errorAsAny?.code === "ER_NO_DEFAULT_FOR_FIELD") {
    res.status(400).json({ error: errorAsAny?.sqlMessage });
  } else {
    res.status(500).json(err);
  }
});

export const server = app.listen(PORT, () => {
  console.log(`Server levantado en el puerto ${PORT}`);
});
```

