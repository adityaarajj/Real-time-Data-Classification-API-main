const middleware = require("../../../app/auth/middleware");
const jwt = require("jsonwebtoken");

// Your secret key for JWT signing (should match with the one used in your application)
const secretKey = "your-secret-key";

// Mock the reply object
const createMockReply = () => {
  return {
    send: jest.fn(),
  };
};

// Realistic request object with jwtVerify method
const createRequestWithToken = (token) => {
  return {
    jwtVerify: function () {
      return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, decoded) => {
          if (err) {
            return reject(err);
          }
          resolve(decoded);
        });
      });
    },
  };
};

describe("JWT Middleware", () => {
  test("should call jwtVerify successfully with valid token", async () => {
    const validToken = jwt.sign({ user: "test" }, secretKey);
    const request = createRequestWithToken(validToken);
    const reply = createMockReply();

    await middleware(request, reply);

    expect(reply.send).not.toHaveBeenCalled();
  });

  test("should handle jwtVerify error with invalid token", async () => {
    const invalidToken = "invalid.token";
    const request = createRequestWithToken(invalidToken);
    const reply = createMockReply();

    await middleware(request, reply);

    expect(reply.send).toHaveBeenCalled();
    expect(reply.send.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(reply.send.mock.calls[0][0].message).toBe("jwt malformed");
  });
});
