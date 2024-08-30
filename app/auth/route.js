const fastify = require("fastify");
const userController = require("./controller");
const authMiddleware = require("./middleware");

module.exports = async (fastify, _opts) => {
  fastify.post("/register", userController.register);
  fastify.post("/login", userController.login);
  fastify.post("/eval", userController.evaluater);
  fastify.post(
    "/createrule",
    { preHandler: [authMiddleware] },
    userController.createrulehandler
  );
  fastify.get(
    "/readrules",
    { preHandler: [authMiddleware] },
    userController.readrulehandler
  );
  fastify.put(
    "/updaterule",
    { preHandler: [authMiddleware] },
    userController.updaterulehandler
  );
  fastify.delete(
    "/deleterule",
    { preHandler: [authMiddleware] },
    userController.deleterulehandler
  );
};
