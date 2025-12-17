// ESM wrapper that re-exports the CommonJS `ms` package as a named export.
// This allows `import { ms } from 'ms'` to work when Node is loading ESM.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const msPkg = require('ms');

// `ms` is the exported function from the package
export const ms = msPkg;
export default msPkg;
