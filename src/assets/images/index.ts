// Export the public URL for static assets so bundlers don't need a loader for binary imports.
// The Angular CLI / build serves files in `src/assets` at `/assets`.
import errors from './errors';
import logo from './logo.png';

export default {
  logo,
  errors,
};
