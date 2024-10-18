export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    transform: {
      '^.+\\.tsx?$': ['ts-jest', { useESM: true }], // ts-jest config conforme o aviso
    },
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transformIgnorePatterns: [
      '<rootDir>/dist/', // Ignora a pasta dist
      'node_modules/(?!.*\\.mjs$)', // Transformar módulos ESM do node_modules
    ],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'], // Ignora o dist ao rodar os testes
  };
  