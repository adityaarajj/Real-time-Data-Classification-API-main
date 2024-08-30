module.exports = {
  testEnvironment: "node",
  testMatch: [
    "<rootDir>/test/unit/**/*.test.js", // Matches all .test.js files in test/unit and its subdirectories
    "<rootDir>/test/integration/**/*.test.js", // Matches all .test.js files in test/integration and its subdirectories
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  verbose: true,
  collectCoverage: true,
};
