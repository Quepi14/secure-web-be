const { DataTypes }=require('sequelize')

module.exports= (sequelize) => {
  const comment = sequelize.define('comment', {
    comment: {
      type:DataTypes.TEXT,
      allowNull: false
    },
    user_id : {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    image  : {
      type: DataTypes.STRING,
      allowNull: true
    },
  },{
    tableName: 'comments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  })

  return comment
}