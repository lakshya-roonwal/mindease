const nextJest = require("next/jest.js");

const createJestConfig = nextJest({
  dir: "./",
});

const config = {
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/lib/**/*.{ts,tsx}",
    "src/app/api/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
  ],
  testMatch: [
    "<rootDir>/src/__tests__/**/*.test.[jt]s?(x)"
  ]
};

module.exports = createJestConfig(config);
