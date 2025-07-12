const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    const log = sequelize.define('log', {
        action: DataTypes.STRING,
        username: DataTypes.STRING,
        target_com: DataTypes.INTEGER,
        description: DataTypes.TEXT
    })

    log.associate = models => {
        log.belongsTo(models.user, { foreignKey: 'user_id'})
    }

    return log
}