export default {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'jsdom',

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },

  extensionsToTreatAsEsm: ['.ts', '.tsx'],

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
}
