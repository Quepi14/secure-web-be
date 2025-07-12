const { DataTypes} = require('sequelize')

module.exports  = (sequelize)=>{
  const log = sequelize.define('log', {
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_id: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    username: {
      type:DataTypes.STRING,
      allowNull:false
    },
    target_com: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description:{
      type: DataTypes.TEXT,
      allowNull: true
    }
  },{
    tableName : 'log',
    timestamps:true,
    createdAt:'created_at',
    updatedAt: false
  })

  return log
}