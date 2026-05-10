import { Sequelize } from 'sequelize';
import dotenv from 'dotenv'; // 1. Import dotenv

dotenv.config(); // 2. THIS IS CRITICAL: It loads the variables from your .env file

// 3. Pass the variables exactly like this
const sequelize = new Sequelize(
  process.env.DB_DATABASE, 
  process.env.DB_USERNAME, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    dialect: 'mariadb'
  }
);

export default sequelize;