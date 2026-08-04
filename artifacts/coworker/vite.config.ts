import path from 'path';
import { defineConfig } from 'vite';

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    'PORT environment variable is required but was not provided.',
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    'BASE_PATH environment variable is required but was not provided.',
  );
}

export default defineConfig({
  base: basePath,
  plugins: [],
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, 'index.html'),
        executiveSummary: path.resolve(import.meta.dirname, 'executive-summary.html'),
        externalResearch: path.resolve(import.meta.dirname, 'external-research.html'),
        decisionPath: path.resolve(import.meta.dirname, 'decision-path.html'),
        supportBrief: path.resolve(import.meta.dirname, 'capability-support-brief.html'),
        knowledgeGrounding: path.resolve(import.meta.dirname, 'capability-knowledge-grounding.html'),
        stakeholderMap: path.resolve(import.meta.dirname, 'capability-stakeholder-map.html'),
        delegatedAction: path.resolve(import.meta.dirname, 'capability-delegated-action.html'),
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: false,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
