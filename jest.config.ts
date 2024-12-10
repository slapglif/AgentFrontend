import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
const config: Config = {
  // Import paths from tsconfig
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/client/src/__mocks__/fileMock.ts',
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['<rootDir>/**/*.test.{ts,tsx}'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: './tsconfig.json',
        babelConfig: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react',
            '@babel/preset-typescript',
          ],
        },
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    '/node_modules/(?!(@radix-ui|class-variance-authority|tailwind-merge|clsx|lucide-react)/)',
  ],
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
      isolatedModules: true,
    },
  },
};

export default config;
