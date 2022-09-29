import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    'birzha',
    'chebok',
    '1807',
    {
        host: 'localhost',
        port: '5432',
        dialect: 'postgres'
    }
);

export default sequelize;