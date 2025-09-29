import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/$1',
    '@context/(.*)': '<rootDir>/src/contexts/$1',
    '@shared/(.*)': '<rootDir>/src/contexts/shared/$1',
    '@tracking/(.*)': '<rootDir>/src/contexts/tracking/$1',
    '@interfaces/(.*)': '<rootDir>/src/interfaces/$1',
    '@test/(.*)': '<rootDir>/test/$1',
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
  clearMocks: true,
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};

export default config;
