import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const connection = new Sequelize(
    process.env.DB_SCHEMA_NAME,
    process.env.DB_USER,
    process.env.DB_KEY,
    {
        host: process.env.DB_HOST_NAME,
        dialect: process.env.DB_NAME,
        timezone: "-03:00",
    },
);

export default connection;
