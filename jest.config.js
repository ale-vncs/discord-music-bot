const { resolve } = require('path')
const root = resolve(__dirname)

module.exports = {
  rootDir: root,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 30000,
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    '@test/(.*)': '<rootDir>/test/$1',
    '@utils/(.*)': '<rootDir>/src/app/utils/$1',
    '@services/(.*)': '<rootDir>/src/app/services/$1',
    '@models/(.*)': '<rootDir>/src/app/models/$1',
    '@logger': '<rootDir>/src/logger',
    '@typings/(.*)': '<rootDir>/typings/$1',
    '@enums/(.*)': '<rootDir>/src/app/enums/$1'
  }
}
