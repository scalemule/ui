import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: { 'phone/index': 'src/phone/index.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
  },
  {
    entry: { 'react/index': 'src/react/index.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    clean: false, // phone/index.* already written by first config
    external: ['react', 'react-dom'],
  },
  {
    entry: { 'share/index': 'src/share/index.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    clean: false,
  },
])
