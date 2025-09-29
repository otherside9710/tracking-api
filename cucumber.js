const tsconfig = require('./tsconfig.json');
require('ts-node').register({
  files: true,
  transpileOnly: true,
  project: './tsconfig.json'
});
require('tsconfig-paths').register({
  baseUrl: tsconfig.compilerOptions.baseUrl,
  paths: tsconfig.compilerOptions.paths
});

module.exports = {
  default: {
    paths: ['test/acceptance/features/**/*.feature'],
    require: [
      'test/acceptance/features/step_definitions/**/*.ts'
    ],
    format: ['progress-bar']
  }
};
