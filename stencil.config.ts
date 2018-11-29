import { Config } from '@stencil/core';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

export const config: Config = {
  namespace: 'jh-pdf-viewer',
  nodeResolve: {
    preferBuiltins:true
  },
  outputTargets:[
    { type: 'dist' },
    { type: 'docs' },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ],
  plugins: [
    builtins({
      browser: true,
      preferBuiltins:true
    }),
    globals({
      browser: true,
      preferBuiltins:true
    })
  ]
};
