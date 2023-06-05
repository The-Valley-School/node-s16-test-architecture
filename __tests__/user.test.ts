import { mongoConnect } from "../src/domain/repositories/mongo-repository";
import mongoose from "mongoose";
import { appInstance } from "../src/index";
import request from "supertest";
import { IUser, User } from "../src/domain/entities/user-entity";
import { app } from "../src/server";

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

  let token: string;
  let userId: string;

  beforeAll(async () => {
    await mongoConnect();
    await User.collection.drop();
    console.log("Eliminados todos los usuarios");
  });

  afterAll(async () => {
    await mongoose.connection.close();
    appInstance.close();
  });

  it("Simple test to check jest in working", () => {
    expect(true).toBeTruthy();
  });

  it("Simple test to check jest in working", () => {
    const miTexto = "Hola chicos";
    expect(miTexto.length).toBe(11);
  });

  it("POST /user - this should create an user", async () => {
    const response = await request(app).post("/user").send(userMock).expect(201);

    expect(response.body).toHaveProperty("_id");
    expect(response.body.email).toBe(userMock.email);

    userId = response.body._id;
  });

  it("POST /user/login - with valid credentials returns 200 and token", async () => {
    const credentials = {
      email: userMock.email,
      password: userMock.password,
    };

    const response = await request(app).post("/user/login").send(credentials).expect(200);

    expect(response.body).toHaveProperty("token");
    token = response.body.token;
  });

  it("POST /user/login - with worng credentials returns 401 and no token", async () => {
    const credentials = {
      email: userMock.email,
      password: "BAD PASSWORD",
    };

    const response = await request(app).post("/user/login").send(credentials).expect(401);

    expect(response.body.token).toBeUndefined();
  });

  it("GET /user - returns a list with the users", async () => {
    const response = await request(app).get("/user").expect(200);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].email).toBe(userMock.email);
    expect(response.body.totalItems).toBe(1);
    expect(response.body.totalPages).toBe(1);
    expect(response.body.currentPage).toBe(1);
  });

  it("PUT /user/id - Modify user when token is sent", async () => {
    const updatedData = {
      firstName: "Edu",
      lastName: "Cuadrado",
    };

    const response = await request(app).put(`/user/${userId}`).set("Authorization", `Bearer ${token}`).send(updatedData).expect(200);

    expect(response.body.firstName).toBe(updatedData.firstName);
    expect(response.body.email).toBe(userMock.email);
    expect(response.body._id).toBe(userId);
  });

  it("PUT /user/id - Should not modify user when no token present", async () => {
    const updatedData = {
      lastName: "Cuadrado",
    };

    const response = await request(app).put(`/user/${userId}`).send(updatedData).expect(401);

    expect(response.body.error).toBe("No tienes autorización para realizar esta operación");
  });

  it("DELETE /user/id -  Do not delete user whe no token is present", async () => {
    const response = await request(app).delete(`/user/${userId}`).expect(401);

    expect(response.body.error).toBe("No tienes autorización para realizar esta operación");
  });

  it("DELETE /user/id -  Deletes user when token is OK", async () => {
    const response = await request(app).delete(`/user/${userId}`).set("Authorization", `Bearer ${token}`).expect(200);

    expect(response.body._id).toBe(userId);
  });
});
