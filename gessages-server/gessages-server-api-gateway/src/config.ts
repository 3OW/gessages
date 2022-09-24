/**
 * This is a sample config file.
 * Change according your own needs or pass config via
 * environment variables if using docker.
 */

// default port of the application
export const DEFAULT_PORT = 3000;

// default log level
export const DEFAULT_LOG_LEVEL = "debug";

// Microservices
export const USERS = "http://localhost:3001";
export const MESSAGES = "http://localhost:3002";

// JWT HS512 Key
export const SECRET = "YourSecretKey";


// default Redis settings
export const DEFAULT_DB_HOST = "192.168.5.204";
export const DEFAULT_DB_PORT = 6379;
export const DEFAULT_DB_USER = "default";
export const DEFAULT_DB_PASS = "";