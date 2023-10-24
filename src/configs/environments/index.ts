import * as dotenv from 'dotenv';

// config use env
dotenv.config();

// cross domain
const CORS_ORIGIN: string[] = ['http://localhost:3000'];

// environment
const NODE_ENV: string = process.env.NODE_ENV;
const PORT: number = +process.env.PORT;
const HASH: number = +process.env.HASH;
const SERVER_NAME = 'mega_market';

// mail
const MAIL_HOST: string = process.env.MAIL_HOST;
const MAIL_PORT: number = +process.env.MAIL_PORT;
const MAIL_USER: string = process.env.MAIL_USER;
const MAIL_PASSWORD: string = process.env.MAIL_PASSWORD;

// throttle
const THROTTLE_TTL: number = +process.env.THROTTLE_TTL;
const THROTTLE_LIMIT: number = +process.env.THROTTLE_LIMIT;

// redis
const REDIS_HOST: string = process.env.REDIS_HOST;
const REDIS_PORT: number = +process.env.REDIS_PORT;
const REDIS_PASSWORD: string = process.env.REDIS_PASSWORD;
const REDIS_DBNAME: number = +process.env.REDIS_DBNAME;
const REDIS_USERNAME: string = process.env.REDIS_USERNAME;

// postgres
const POSTGRES_USER: string = process.env.POSTGRES_USER;
const POSTGRES_PASSWORD: string = process.env.POSTGRES_PASSWORD;
const POSTGRES_DB: string = process.env.POSTGRES_DB;
const POSTGRES_HOST: string = process.env.POSTGRES_HOST;
const POSTGRES_PORT: number = +process.env.POSTGRES_PORT;

// mongodb
const MONGO_URL: string = process.env.MONGO_URL;
const MONGO_HOST: string = process.env.MONGO_HOST;
const MONGO_PORT: number = +process.env.MONGO_PORT;
const MONGO_INITDB_DATABASE: string = process.env.MONGO_INITDB_DATABASE;
const MONGO_INITDB_ROOT_USERNAME: string = process.env.MONGO_INITDB_ROOT_USERNAME;
const MONGO_INITDB_ROOT_PASSWORD: string = process.env.MONGO_INITDB_ROOT_PASSWORD;

// jwt
const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRATION_TIME: string = process.env.ACCESS_TOKEN_EXPIRATION_TIME;
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRATION_TIME: string = process.env.REFRESH_TOKEN_EXPIRATION_TIME;
const APP_SECRET: string = process.env.APP_SECRET;

// cloud
const FOLDER_NAME: string = process.env.FOLDER_NAME;
const CLOUD_NAME: string = process.env.CLOUD_NAME;
const API_KEY: string = process.env.API_KEY;
const API_SECRET: string = process.env.API_SECRET;

// firebase
const FIREBASE_TYPE: string = process.env.FIREBASE_TYPE;
const FIREBASE_PROJECT_ID: string = process.env.FIREBASE_PROJECT_ID;
const FIREBASE_PRIVATE_KEY_ID: string = process.env.FIREBASE_PRIVATE_KEY_ID;
const FIREBASE_PRIVATE_KEY: string = process.env.FIREBASE_PRIVATE_KEY;
const FIREBASE_CLIENT_EMAIL: string = process.env.FIREBASE_CLIENT_EMAIL;
const FIREBASE_CLIENT_ID: string = process.env.FIREBASE_CLIENT_ID;
const FIREBASE_AUTH_URI: string = process.env.FIREBASE_AUTH_URI;
const FIREBASE_TOKEN_URI: string = process.env.FIREBASE_TOKEN_URI;
const FIREBASE_AUTH_PROVIDER_X509_CERT_URL: string = process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL;
const FIREBASE_CLIENT_X509_CERT_URL: string = process.env.FIREBASE_CLIENT_X509_CERT_URL;
const FIREBASE_API_KEY: string = process.env.FIREBASE_API_KEY;
const FIREBASE_AUTH_DOMAIN: string = process.env.FIREBASE_AUTH_DOMAIN;
const FIREBASE_STORAGE_BUCKET: string = process.env.FIREBASE_STORAGE_BUCKET;
const FIREBASE_MESSAGING_SENDER_ID: string = process.env.FIREBASE_MESSAGING_SENDER_ID;
const FIREBASE_APP_ID: string = process.env.FIREBASE_APP_ID;
const FIREBASE_MEASUREMENT_ID: string = process.env.FIREBASE_MEASUREMENT_ID;
const FIREBASE_ADMIN_CLIENT_EMAIL: string = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const FIREBASE_SECURE_TOKEN_URL: string = process.env.FIREBASE_SECURE_TOKEN_URL;

export const Environment = {
  ACCESS_TOKEN_EXPIRATION_TIME,
  ACCESS_TOKEN_SECRET,
  API_KEY,
  API_SECRET,
  CLOUD_NAME,
  CORS_ORIGIN,
  HASH,
  NODE_ENV,
  PORT,
  POSTGRES_DB,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_USER,
  REFRESH_TOKEN_EXPIRATION_TIME,
  REFRESH_TOKEN_SECRET,
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
  FIREBASE_ADMIN_CLIENT_EMAIL,
  FIREBASE_TYPE,
  FIREBASE_PRIVATE_KEY_ID,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_CLIENT_ID,
  FIREBASE_AUTH_URI,
  FIREBASE_TOKEN_URI,
  FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  FIREBASE_CLIENT_X509_CERT_URL,
  APP_SECRET,
  FIREBASE_SECURE_TOKEN_URL,
  MONGO_URL,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_INITDB_DATABASE,
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASSWORD,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  REDIS_DBNAME,
  REDIS_USERNAME,
  THROTTLE_LIMIT,
  THROTTLE_TTL,
  SERVER_NAME,
  FOLDER_NAME,
};
