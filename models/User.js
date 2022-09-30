import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
    chatId: {type: DataTypes.STRING, unique: true},
    userName: {type: DataTypes.STRING},
    authorized: {type: DataTypes.BOOLEAN, defaultValue: false},
});


export default User;
