const request = require("supertest");
const { app, startServer, stopServer } = require("../../app/app");
const User = require("../../app/Users/user");
const jwt = require("jsonwebtoken");
const Rule = require("../../app/rules/rules");

describe("Auth Routes Integration Test", () => {
  let server;
  let api;
  let token;

  beforeAll(async () => {
    // Start the server and get the actual server instance
    server = await startServer();
    api = request(server); // Attach supertest to the actual server instance
  });

  afterAll(async () => {
    await stopServer(); // Properly close the Fastify server
  });

  const mockUser = {
    username: "testuser",
    email: "test@example.com",
    password: "password123",
  };

  // Clear the User and Rule collection before each test to ensure test isolation
  beforeEach(async () => {
    await User.deleteMany({});
    token = jwt.sign({ id: "testuser" }, "Private"); // Generate a test token
    await Rule.deleteMany({});
  });

  test("should register a user", async () => {
    const res = await api.post("/dsl/register").send(mockUser);
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User Registration Successful!");
  });

  test("should not register a user with existing email or username", async () => {
    await new User(mockUser).save();
    const res = await api.post("/dsl/register").send(mockUser);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Username or Email already exists");
  });

  test("should login a user", async () => {
    await api.post("/dsl/register").send(mockUser);
    const res = await api.post("/dsl/login").send({
      username: mockUser.username,
      password: mockUser.password,
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfuly login!");
  });

  test("should not login with incorrect credentials", async () => {
    await new User(mockUser).save();
    const res = await api.post("/dsl/login").send({
      username: mockUser.username,
      password: "wrongpassword",
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Incorrect Password!");
  });

  test("should evaluate a DSL rule", async () => {
    const evalData = {
      rule: `count('a') < 2`,
      str: "abc",
    };
    const res = await api
      .post("/dsl/eval")
      .set("Authorization", `Bearer ${token}`)
      .send(evalData);
    expect(res.status).toBe(200);
    expect(res.body).toBe(true);
  });

  test("should create a rule", async () => {
    const ruleData = { ruleName: "testRule" };
    const res = await api
      .post("/dsl/createrule")
      .set("Authorization", `Bearer ${token}`)
      .send(ruleData);
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Rule Created Successful!");
  });

  test("should read all rules", async () => {
    await new Rule({ ruleName: "rule1" }).save();
    await new Rule({ ruleName: "rule2" }).save();

    const res = await api
      .get("/dsl/readrules")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(["rule1", "rule2"]);
  });

  test("should update a rule", async () => {
    await new Rule({ ruleName: "oldRule" }).save();
    const res = await api
      .put("/dsl/updaterule")
      .set("Authorization", `Bearer ${token}`)
      .send({ ruleName: "oldRule", updatedRule: "newRule" });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Rule updated successfully");
  });

  test("should delete a rule", async () => {
    await new Rule({ ruleName: "ruleToDelete" }).save();
    const res = await api
      .delete("/dsl/deleterule")
      .set("Authorization", `Bearer ${token}`)
      .send({ ruleName: "ruleToDelete" });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Rule deleted");
  });
});
