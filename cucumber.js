module.exports = {
  default: {
    paths: ['test/acceptance/features/**/*.feature'],
    require: [
      'ts-node/register/transpile-only',
      'tsconfig-paths/register',
      'test/acceptance/features/support/world.ts',
      'test/acceptance/features/support/hooks.ts',
      'test/acceptance/features/step_definitions/**/*.ts',
    ],
    format: ['progress-bar'],
    publishQuiet: true
  },
};
