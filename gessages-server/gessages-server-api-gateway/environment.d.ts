// declare global env variable to define types
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DEFAULT_LOG_LEVEL: string;
      //Microservice URLs, e.g. "http://localhost:3001"
      USERS: string;
      MESSAGES: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_PASS: string;
    }
  }
}

export {};
