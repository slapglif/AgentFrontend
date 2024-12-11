module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__mocks__/fileMock.ts'
  },
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', {
      jsc: {
        target: 'es2022',
        parser: {
          syntax: 'typescript',
          tsx: true,
          decorators: true,
          dynamicImport: true
        },
        transform: {
          react: {
            runtime: 'automatic'
          }
        }
      },
      sourceMaps: false
    }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@tanstack|lucide-react|react-day-picker|wouter|@radix-ui|@babel)/)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx|js|jsx)'],
  moduleDirectories: ['node_modules', 'src'],
  testEnvironmentOptions: {
    customExportConditions: ['']
  },
  maxWorkers: 1,
  verbose: true,
  testTimeout: 15000,
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
      diagnostics: false
    }
  },
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};
