import coreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  { ignores: ['coverage/**'] },
  ...coreWebVitals,
];

export default config;
