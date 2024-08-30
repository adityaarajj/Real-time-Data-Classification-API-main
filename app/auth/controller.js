const userService = require("./service");
const jwt = require("jsonwebtoken");
const { evaluateDSL } = require("../logic");

module.exports = {
  //function to handle user registration
  register: async (req, res) => {
    try {
      if (
        (await userService.isEmailExists(req.body.email)) &&
        (await userService.isUsernameExists(req.body.username))
      ) {
        res.code(400);
        return {
          message: "Username or Email already exists",
        };
      }
      const user = await userService.create(req.body);
      res.code(201);
      return {
        message: "User Registration Successful!",
      };
    } catch (err) {
      res.code(500);
      return {
        err,
      };
    }
  },
  //function to handle user login
  login: async (req, res) => {
    try {
      const user = await userService.findByUsername(req.body.username);
      if (!user) {
        res.code(400);
        return {
          message: "Incorrect Username!",
        };
      }
      if (
        !(await userService.comparePassword(user.password, req.body.password))
      ) {
        res.code(400);
        return {
          message: "Incorrect Password!",
        };
      }
      const token = jwt.sign({ id: user._id }, "Private");
      res.code(200);
      return {
        message: "Successfuly login!",
        data: {
          user,
          token,
        },
      };
    } catch (err) {
      res.code(500);
      return {
        err,
      };
    }
  },
  evaluater: async (req, res) => {
    try {
      return evaluateDSL(req.body.rule, req.body.str);
    } catch (err) {
      res.code(500);
      return { err };
    }
  },
  createrulehandler: async (req, res) => {
    try {
      if (await userService.findbyRule(req.body)) {
        res.code(400);
        return {
          message: "Rule already exists",
        };
      }
      const rule = await userService.createrule(req.body);
      res.code(201);
      return {
        message: "Rule Created Successful!",
      };
    } catch (err) {
      res.code(500);
      return { err };
    }
  },
  readrulehandler: async (req, res) => {
    try {
      const result = await userService.readrule();
      const rules = result.map((rule) => rule.ruleName);
      res.code(200).send(rules);
    } catch (err) {
      res.code(500);
      return err;
    }
  },
  updaterulehandler: async (req, res) => {
    try {
      result = await userService.updaterule(req.body);
      if (result.modifiedCount == 1) {
        res.send({ message: "Rule updated successfully" });
      } else {
        res.send({ error: "Failed to update rule" });
      }
    } catch (err) {
      res.code(500);
      return { err };
    }
  },
  deleterulehandler: async (req, res) => {
    try {
      const deletedRule = await userService.deleterule(req.body);
      if (!deletedRule) {
        return res.code(404).send({ error: "Rule not found" });
      }
      return res.code(200).send({ message: "Rule deleted", deletedRule });
    } catch (err) {
      res.code(500);
      return err;
    }
  },
};
