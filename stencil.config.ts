import { Config } from '@stencil/core';

import nodePolyfills from 'rollup-plugin-node-polyfills';

export const config: Config = {
  namespace: 'jh-pdf-viewer',
  nodeResolve: {
    preferBuiltins:true
  },
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  rollupPlugins: {
    before: [
      // Plugins injected before rollupNodeResolve()
      // resolvePlugin()
    ],
    after: [
      // Plugins injected after commonjs()
      nodePolyfills()
    ]
  }
};