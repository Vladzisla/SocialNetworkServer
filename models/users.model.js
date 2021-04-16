const {Model, DataTypes} = require("sequelize");
const bcrypt = require("bcrypt")
const sequelize = require('../DBInit/DB.init')

class User extends Model {
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(val) {
            this.setDataValue('password', bcrypt.hashSync(val, 10));
        }
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    secondName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    },
    filePath: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {sequelize, modelName: 'user', tableName: 'user4'});

module.exports = User;
