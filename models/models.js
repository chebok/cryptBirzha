import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
    chat_id: {type: DataTypes.INTEGER, unique: true},
    username: {type: DataTypes.STRING},
    authorized: {type: DataTypes.BOOLEAN, defaultValue: false},
});

const SellRequest = sequelize.define('sell_request', {
    id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
    sellCurrency: {type: DataTypes.STRING, allowNull: false},
    count: {type: DataTypes.REAL, allowNull: false},
    buyCurrency: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.REAL, allowNull: false},
    is_open: {type: DataTypes.BOOLEAN, defaultValue: true},
});

const BuyRequest = sequelize.define('buy_request', {
    id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
    count: {type: DataTypes.REAL, allowNull: false},
    is_open: {type: DataTypes.BOOLEAN, defaultValue: true},
});

User.hasMany(SellRequest, {
    foreignKey: {
        type: DataTypes.INTEGER,
        name: 'user_id',
        allowNull: false,
    }
});

User.hasMany(BuyRequest, {
    foreignKey: {
        type: DataTypes.INTEGER,
        name: 'user_id',
        allowNull: false,
    }
});

SellRequest.hasMany(BuyRequest, {
    foreignKey: {
        type: DataTypes.INTEGER,
        name: 'sell_request_id',
        allowNull: false,
    }
});

SellRequest.belongsTo(User, {
    foreignKey: {
        name: 'user_id',
    }
});

BuyRequest.belongsTo(User, {
    foreignKey: {
        name: 'user_id',
    }
});

BuyRequest.belongsTo(SellRequest, {
    foreignKey: {
        name: 'sell_request_id',
    }
});

export {
    User,
    SellRequest,
    BuyRequest,
};
