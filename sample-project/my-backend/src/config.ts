import * as dotenv from "dotenv";
dotenv.config();

export const DB_URL: any = process.env.DB_URL;
export const PORT = parseInt(process.env.PORT || "8080");
export const HOST = process.env.HOST;
export const ENVIRONMENT = process.env.ENVIRONMENT;
export const DB_PASSWORD = process.env.DB_PASSWORD;
