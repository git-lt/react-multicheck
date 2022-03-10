module.exports = {
  rootDir: '../',
  transform: {
    '.*\\.(ts|tsx)$': 'ts-jest',
    '.*\\.(js|jsx)$': 'babel-jest'
},
  restoreMocks: true,
  testMatch: ['<rootDir>/src/**/__tests__/*.test.js'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'], 
  moduleNameMapper: {
    '^.+\\.(css|less)$': 'identity-obj-proxy',
  },
  "setupFilesAfterEnv": [
    "<rootDir>/config/jest.setup.js"
  ]
  // collectCoverage: true,
  // coverageDirectory: '<rootDir>/coverage/',
  // coveragePathIgnorePatterns: ['<rootDir>/coverage/']
};
