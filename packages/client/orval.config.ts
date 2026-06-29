import { defineConfig } from 'orval';

export default defineConfig({
  graphitalia_cli: {
    input: {
      target: './graphitalia-openapi.yml',
    },
    output: {
      mode: 'single',
      target: './src/client.ts',
      schemas: './src/model',
      mock: false,
      client: 'axios',
    },
    hooks: {
      afterAllFilesWrite: 'npx prettier --write',
    },
  },
});
