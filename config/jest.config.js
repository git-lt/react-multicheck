module.exports = {
  rootDir: '../',
  transform: {
    '.*\\.(ts|tsx)$': 'ts-jest',
    '.*\\.(js|jsx)$': 'babel-jest'
},
  restoreMocks: true,
  testMatch: ['<rootDir>/src/**/__tests__/*.test.js'],
  testEnvironment: 'jsdom', 
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'], 
  moduleNameMapper: {
    '^.+\\.(css|less)$': 'identity-obj-proxy',
  },
  "setupFilesAfterEnv": [
    "<rootDir>/config/jest.setup.js"
  ],
  transformIgnorePatterns: [
    'node_modules\/[^/]+?\/(?!(es|node_modules)\/)',
  ]

  // collectCoverage: true,
  // coverageDirectory: '<rootDir>/coverage/',
  // coveragePathIgnorePatterns: ['<rootDir>/coverage/']
};
