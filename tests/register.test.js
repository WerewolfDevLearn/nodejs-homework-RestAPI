/* eslint-disable no-undef */
/* ответ должен иметь статус-код 200
в ответе должен возвращаться токен
в ответе должен возвращаться объект user
 с 2 полями email и subscription, имеющие тип данных String */
const mongoose = require("mongoose");
const app = require("../app");
const supertest = require("supertest");
const User = require("../models/userShm");

const { DB_HOST_TEST, PORT } = process.env;

describe("test register route", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(DB_HOST_TEST);
    server = app.listen(PORT);
  });
  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });
  afterEach(async () => {
    await User.deleteMany({});
  });
  test("test correct register data", async () => {
    const registerData = {
      email: "werewolf@gmail.com",
      password: "password",
    };
    const { body, statusCode } = await supertest(app).post("/api/users/register").send(registerData);
    expect(statusCode).toBe(201);

    expect(body.user.email).toBe(registerData.email);
    expect(typeof body.user.subscription).toBe("string");
    expect(typeof body.token).toBe("string");
    const user = await User.findOne({ email: registerData.email });
    expect(body.user.email).toBe(user.email);
    expect(body.token).toBe(user.token);
  });
});
