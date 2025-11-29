// Lightweight logger that silences debug/info in production builds.
const isDev =
  typeof __DEV__ !== "undefined"
    ? __DEV__
    : process.env.NODE_ENV !== "production";

function debug(...args: any[]) {
  if (isDev) {
    // preserve stack trace formatting
    // eslint-disable-next-line no-console
    console.debug(...args);
  }
}

function info(...args: any[]) {
  if (isDev) {
    // eslint-disable-next-line no-console
    console.info(...args);
  }
}

function warn(...args: any[]) {
  // keep warnings visible in development; in production optionally send to remote logging
  if (isDev) {
    // eslint-disable-next-line no-console
    console.warn(...args);
  }
}

function error(...args: any[]) {
  // Always log errors locally - you may hook this to a remote error tracker
  // eslint-disable-next-line no-console
  console.error(...args);
}

const logger = { debug, info, warn, error };

export default logger;
