const controller = require("../../../app/auth/controller");
const userService = require("../../../app/auth/service");

jest.mock("../../../app/auth/service");

describe("Auth Controller", () => {
  let req, res;

  // Initialize req and res before each test case
  beforeEach(() => {
    req = {
      body: {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      },
    };
    res = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  //register method test

  // Test case: User already exists
  test("register should respond with error if user already exists", async () => {
    userService.isEmailExists.mockResolvedValue(true);
    userService.isUsernameExists.mockResolvedValue(true);

    const response = await controller.register(req, res);

    expect(res.code).toHaveBeenCalledWith(400);
    expect(response.message).toBe("Username or Email already exists");
  });

  // Test case: Create a new user
  test("register should create user if they do not exist", async () => {
    userService.isEmailExists.mockResolvedValue(false);
    userService.isUsernameExists.mockResolvedValue(false);
    userService.create.mockResolvedValue({ id: "newuser" });

    const response = await controller.register(req, res);

    expect(res.code).toHaveBeenCalledWith(201);
    expect(response.message).toBe("User Registration Successful!");
  });

  //login method test
  test("login should respond with error if username is incorrect", async () => {
    userService.findByUsername.mockResolvedValue(null);

    const response = await controller.login(req, res);

    expect(res.code).toHaveBeenCalledWith(400);
    expect(response.message).toBe("Incorrect Username!");
  });

  test("login should respond with error if password is incorrect", async () => {
    userService.findByUsername.mockResolvedValue({
      username: "testuser",
      password: "hashedpassword",
    });
    userService.comparePassword.mockResolvedValue(false);

    const response = await controller.login(req, res);

    expect(res.code).toHaveBeenCalledWith(400);
    expect(response.message).toBe("Incorrect Password!");
  });

  test("login should return user and token if credentials are correct", async () => {
    userService.findByUsername.mockResolvedValue({
      _id: "userid",
      username: "testuser",
      password: "hashedpassword",
    });
    userService.comparePassword.mockResolvedValue(true);

    const response = await controller.login(req, res);

    expect(res.code).toHaveBeenCalledWith(200);
    expect(response.message).toBe("Successfuly login!");
    expect(response.data).toHaveProperty("user");
    expect(response.data).toHaveProperty("token");
  });

  //evaluater method test
  test("evaluater should return evaluation result", async () => {
    req = {
      body: [
        { rule: "count('a') < 3", str: "banana" }, // This should be false
        { rule: "sum() > 4", str: "banana" }, // This should be true
      ],
    };
    const response = [];
    for (const ruleObject of req.body) {
      const result = await controller.evaluater({ body: ruleObject }, res);
      response.push(result);
    }
    expect(response).toEqual([false, true]);
  });

  //createrulehandler method test
  test("createrulehandler should respond with error if rule exists", async () => {
    userService.findbyRule.mockResolvedValue(true);

    const response = await controller.createrulehandler(req, res);

    expect(res.code).toHaveBeenCalledWith(400);
    expect(response.message).toBe("Rule already exists");
  });

  test("createrulehandler should create rule if not exists", async () => {
    userService.findbyRule.mockResolvedValue(false);
    userService.createrule.mockResolvedValue({ ruleName: "newrule" });

    const response = await controller.createrulehandler(req, res);

    expect(res.code).toHaveBeenCalledWith(201);
    expect(response.message).toBe("Rule Created Successful!");
  });

  //readruleshandler method test
  test("should return rules successfully", async () => {
    // Mocking the readrule function to return an array of rules
    const mockRules = [
      { ruleName: "rule1" },
      { ruleName: "rule2" },
      { ruleName: "rule3" },
    ];
    userService.readrule.mockResolvedValue(mockRules);

    // Calling the readrulehandler
    await controller.readrulehandler(req, res);

    // Expect the response code to be 200
    expect(res.code).toHaveBeenCalledWith(200);
    // Expect the send method to be called with the list of rule names
    expect(res.send).toHaveBeenCalledWith(["rule1", "rule2", "rule3"]);
  });

  //updaterulehandler method test

  test("should update rule successfully", async () => {
    userService.updaterule.mockResolvedValue({ modifiedCount: 1 });

    await controller.updaterulehandler(req, res);

    expect(res.send).toHaveBeenCalledWith({
      message: "Rule updated successfully",
    });
  });

  test("should fail to update rule", async () => {
    userService.updaterule.mockResolvedValue({ modifiedCount: 0 });

    await controller.updaterulehandler(req, res);

    expect(res.send).toHaveBeenCalledWith({ error: "Failed to update rule" });
  });

  //deleterulehandler method test
  test("should delete rule successfully", async () => {
    const mockDeletedRule = { ruleName: "ruleToDelete" };
    userService.deleterule.mockResolvedValue(mockDeletedRule);

    // Calling the deleterulehandler
    await controller.deleterulehandler(req, res);

    // Expect the response code to be 200
    expect(res.code).toHaveBeenCalledWith(200);
    // Expect the send method to be called with the success message and deleted rule
    expect(res.send).toHaveBeenCalledWith({
      message: "Rule deleted",
      deletedRule: mockDeletedRule,
    });
  });

  test("should handle rule not found", async () => {
    userService.deleterule.mockResolvedValue(null);

    await controller.deleterulehandler(req, res);

    expect(res.code).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({ error: "Rule not found" });
  });
});
