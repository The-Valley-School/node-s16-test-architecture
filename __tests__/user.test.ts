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
