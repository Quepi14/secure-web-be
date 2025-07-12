const { DataTypes } = require("sequelize");
const { sequelize } = require("./db");

module.exports = (sequelize, DataTypes) => {
    const comment = sequelize.define('comment', {
        comment: DataTypes.TEXT,
        image: DataTypes.STRING
    })

    comment.associate = models => {
        comment.belongTo(models.user, {foreginKey: 'user_id'})
    }

    return comment
}