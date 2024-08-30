const User = require("../../../app/Users/user");
const rule = require("../../../app/rules/rules");
const { evaluateDSL } = require("../../../app/logic");
const userService = require("../../../app/auth/service");
const bcrypt = require("bcrypt");

jest.mock("../../../app/Users/user");
jest.mock("../../../app/rules/rules");
jest.mock("../../../app/logic");

describe("User Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findByUsername", () => {
    test("should find a user by username", async () => {
      const mockUser = { username: "testuser", email: "test@example.com" };
      User.findOne.mockResolvedValue(mockUser);

      const result = await userService.findByUsername("testuser");

      expect(User.findOne).toHaveBeenCalledWith({ username: "testuser" });
      expect(result).toBe(mockUser);
    });

    test("should return null if user is not found", async () => {
      User.findOne.mockResolvedValue(null);

      const result = await userService.findByUsername("nonexistent");

      expect(User.findOne).toHaveBeenCalledWith({ username: "nonexistent" });
      expect(result).toBe(null);
    });
  });

  describe("create", () => {
    test("should create a new user with hashed password", async () => {
      const userData = {
        username: "newuser",
        email: "newuser@example.com",
        password: "plaintext",
      };
      const hashedPassword = "hashedpassword";
      jest.spyOn(bcrypt, "hashSync").mockReturnValue(hashedPassword);
      User.create.mockResolvedValue(userData);

      const result = await userService.create(userData);

      expect(bcrypt.hashSync).toHaveBeenCalledWith("plaintext", 10);
      expect(User.create).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword,
      });
      expect(result).toBe(userData);
    });
  });

  describe("isUsernameExists", () => {
    test("should return true if username exists", async () => {
      User.exists.mockResolvedValue(true);

      const result = await userService.isUsernameExists("existinguser");

      expect(User.exists).toHaveBeenCalledWith({ username: "existinguser" });
      expect(result).toBe(true);
    });

    test("should return false if username does not exist", async () => {
      User.exists.mockResolvedValue(false);

      const result = await userService.isUsernameExists("nonexistent");

      expect(User.exists).toHaveBeenCalledWith({ username: "nonexistent" });
      expect(result).toBe(false);
    });
  });

  describe("isEmailExists", () => {
    test("should return true if email exists", async () => {
      User.exists.mockResolvedValue(true);

      const result = await userService.isEmailExists("existing@example.com");

      expect(User.exists).toHaveBeenCalledWith({
        email: "existing@example.com",
      });
      expect(result).toBe(true);
    });

    test("should return false if email does not exist", async () => {
      User.exists.mockResolvedValue(false);

      const result = await userService.isEmailExists("nonexistent@example.com");

      expect(User.exists).toHaveBeenCalledWith({
        email: "nonexistent@example.com",
      });
      expect(result).toBe(false);
    });
  });

  describe("createrule", () => {
    test("should create a new rule", async () => {
      const ruleData = { ruleName: "newrule" };
      rule.create.mockResolvedValue(ruleData);

      const result = await userService.createrule(ruleData);

      expect(rule.create).toHaveBeenCalledWith(ruleData);
      expect(result).toBe(ruleData);
    });
  });

  describe("readrule", () => {
    test("should read and return rules", async () => {
      const mockRules = [{ ruleName: "rule1" }, { ruleName: "rule2" }];
      rule.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockRules),
      });

      const result = await userService.readrule();

      expect(rule.find).toHaveBeenCalled();
      expect(result).toEqual(mockRules);
    });
  });

  describe("updaterule", () => {
    test("should update an existing rule", async () => {
      const updateData = { ruleName: "rule1", updatedRule: "newrule1" };
      const mockUpdatedRule = { ...updateData, id: "rule123" };
      rule.updateOne.mockResolvedValue({ modifiedCount: 1 });

      const result = await userService.updaterule(updateData);

      expect(rule.updateOne).toHaveBeenCalledWith(
        { ruleName: "rule1" },
        { $set: { ruleName: "newrule1" } }
      );
      expect(result).toEqual({ modifiedCount: 1 });
    });

    test("should return error if rule is not updated", async () => {
      const updateData = { ruleName: "nonexistent", updatedRule: "newrule" };
      rule.updateOne.mockResolvedValue({ modifiedCount: 0 });

      const result = await userService.updaterule(updateData);

      expect(rule.updateOne).toHaveBeenCalledWith(
        { ruleName: "nonexistent" },
        { $set: { ruleName: "newrule" } }
      );
      expect(result).toEqual({ modifiedCount: 0 });
    });
  });

  describe("deleterule", () => {
    test("should delete an existing rule", async () => {
      const deleteData = { ruleName: "rule1" };
      const mockDeletedRule = { ...deleteData, id: "rule123" };
      rule.findOneAndDelete.mockResolvedValue(mockDeletedRule);

      const result = await userService.deleterule(deleteData);

      expect(rule.findOneAndDelete).toHaveBeenCalledWith({ ruleName: "rule1" });
      expect(result).toEqual(mockDeletedRule);
    });

    test("should return null if rule is not found", async () => {
      const deleteData = { ruleName: "nonexistent" };
      rule.findOneAndDelete.mockResolvedValue(null);

      const result = await userService.deleterule(deleteData);

      expect(rule.findOneAndDelete).toHaveBeenCalledWith({
        ruleName: "nonexistent",
      });
      expect(result).toBe(null);
    });
  });

  describe("findbyRule", () => {
    test("should return true if rule exists", async () => {
      rule.exists.mockResolvedValue(true);

      const result = await userService.findbyRule({ ruleName: "existingrule" });

      expect(rule.exists).toHaveBeenCalledWith({ ruleName: "existingrule" });
      expect(result).toBe(true);
    });

    test("should return false if rule does not exist", async () => {
      rule.exists.mockResolvedValue(false);

      const result = await userService.findbyRule({
        ruleName: "nonexistentrule",
      });

      expect(rule.exists).toHaveBeenCalledWith({ ruleName: "nonexistentrule" });
      expect(result).toBe(false);
    });
  });

  describe("applyrules", () => {
    test("should apply rules to data and return results", async () => {
      const data = "testdata";
      const mockRules = ["rule1", "rule2"];
      const mockResults = [
        { rule: "rule1", result: true },
        { rule: "rule2", result: false },
      ];
      evaluateDSL.mockImplementation((rule, data) => {
        return rule === "rule1" ? true : false;
      });

      const result = await userService.applyrules(data, mockRules);

      expect(result).toEqual(mockResults);
    });
  });
});
