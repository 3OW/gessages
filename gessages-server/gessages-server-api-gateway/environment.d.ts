// declare global env variable to define types
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      HOST: string;
      DEFAULT_LOG_LEVEL: string;
      //Microservices
      USERS_HOST: string;
      USERS_PORT: string;
      MESSAGES_HOST: string;
      MESSAGES_PORT: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_PASS: string;
    }
  }
}

export {};
