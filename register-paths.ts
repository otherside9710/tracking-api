import { register } from 'tsconfig-paths';

register({
  baseUrl: './',
  paths: {
    '@app/*': ['src/*'],
    '@context/*': ['src/contexts/*'],
    '@shared/*': ['src/contexts/shared/*'],
    '@tracking/*': ['src/contexts/tracking/*'],
    '@interfaces/*': ['src/interfaces/*'],
    '@test/*': ['test/*'],
  },
});
