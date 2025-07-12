const { toDefaultValue } = require("sequelize/lib/utils");
const { sequelize } = require("./db");

module.exports = ( sequelize, DataTypes) => {
    const user = sequelize.define('user', {
        username:{ type: DataTypes.STRING, unique: true},
        email: {type: DataTypes.STRING, unique:true},
        password: DataTypes.STRING,
        role: {type: DataTypes.STRING, toDefaultValue:'user'}
    })

    user.associate = models => {
        user.hasMany(models.comment, {foreginKey: 'user_id'})
    }

    return user
}