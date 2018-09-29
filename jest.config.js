module.exports = {
  preset: "ts-jest",
  testMatch: ["<rootDir>/test/**/*.(j|t)s?(x)"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^secrets/(.*)": "<rootDir>/secrets/$1",
    "^test/(.*)": "<rootDir>/test/$1"
  },
  moduleDirectories: ["src", "node_modules"],
  watchPathIgnorePatterns: ["<rootDir>/dist"],
  testPathIgnorePatterns: ["<rootDir>/test/helpers/.*"],
  setupTestFrameworkScriptFile: "<rootDir>/jest.init.ts",
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};
