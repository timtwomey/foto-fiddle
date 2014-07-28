module.exports = function(sequelize, DataTypes) {
  var Anchor = sequelize.define('Anchor', {
    target: DataTypes.STRING,
    type: DataTypes.STRING,
    x: DataTypes.INTEGER,
    y: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Anchor.belongsTo(models.Foto)
      }
    }
  })
 
  return Anchor
}