const fastify = require("fastify");
const app = fastify();
const mongoose = require("mongoose");
const WebSocket = require("ws");
const userService = require("./auth/service");
const fastifyJwt = require("fastify-jwt");

// Declare a route
app.get("/", async (request, reply) => {
  return { message: "Hello, Fastify!" };
});

mongoose
  .connect("mongodb://localhost:27017")
  .then(() => {
    console.info("database connected successfully");
  })
  .catch((err) => {
    console.error(`Error connecting database. ${err}`);
    process.exit(1);
  });

const wss = new WebSocket.Server({ port: 3000 });

wss.on("connection", async (ws) => {
  console.log("New client connected");

  // Fetch rules from the database
  try {
    const result = await userService.readrule(); // Wait for the promise to resolve
    const rules = result.map((rule) => rule.ruleName);

    // Handle messages received from the client
    ws.on("message", async (message) => {
      console.log(`Received: ${message}`);
      // Apply rules to the received message
      const data = message.toString();
      const classifications = await userService.applyrules(data, rules);
      ws.send(`${JSON.stringify(classifications)}`);
    });

    // Handle client disconnection
    ws.on("close", () => {
      console.log("Client disconnected");
    });
  } catch (err) {
    console.error("Error fetching rules:", err);
  }
});

console.log("WebSocket server is listening on ws://localhost:3000");

// Register JWT plugin
app.register(fastifyJwt, {
  secret: "Private",
});

app.register(require("./auth/route"), {
  prefix: "/dsl",
});

// Function to start the server (for testing)
async function startServer() {
  try {
    await app.listen({ port: 0 }); // Dynamic port assignment
    return app.server; // Return the underlying server
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

// Function to stop the server (for testing)
async function stopServer() {
  try {
    await app.close();
  } catch (err) {
    app.log.error(err);
  }
}

// Export app and control functions for tests
module.exports = {
  app,
  startServer,
  stopServer,
};
