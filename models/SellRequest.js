import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import User from './User.js';

const SellRequest = sequelize.define('sellRequest', {
    id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
    sellCurrency: {type: DataTypes.STRING, allowNull: false},
    count: {type: DataTypes.REAL, allowNull: false},
    buyCurrency: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.REAL, allowNull: false},
    user_id: {type: DataTypes.INTEGER, references: {
        model: 'user',
        key: 'id',
    }},
    isOpen: {type: DataTypes.BOOLEAN, defaultValue: true},
});

User.hasMany(SellRequest, {
    foreignKey: 'id'
});
export default SellRequest;
