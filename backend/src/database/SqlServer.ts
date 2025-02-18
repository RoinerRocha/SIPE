import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import tedious from "tedious";


dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string, 
  process.env.DB_USER as string, 
  process.env.DB_PASSWORD as string, 
  {
    host: process.env.DB_HOST as string, 
    dialect: "mssql", 
    dialectModule: tedious,
    dialectOptions: {
      options: {
        encrypt: true,
        trustServerCertificate: true,
      },
    },
    logging: console.log, 
  }
);

export default sequelize;