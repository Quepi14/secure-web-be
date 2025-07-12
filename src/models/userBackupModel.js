const { DataTypes } = require('sequelize')
const { sequelize } = require('./db')

module.exports = ( sequelize ) => {
    const user_backup = sequelize.define('user_backup', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull:false
        },
        email: {
            type: DataTypes.STRING,
            allowNull:false
        },
        password: {
            type: DataTypes.STRING,
            allowNull:false
        },
        role: {
            type: DataTypes.STRING,
            allowNull:false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull:false
        },
    },{
        tableName: 'user_backup',
        timestamps: false
    })

    return user_backup
}