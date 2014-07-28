module.exports = function(sequelize, DataTypes) {
  var Foto = sequelize.define('Foto', {
    shortcode: DataTypes.STRING,
    path: DataTypes.STRING,
    title: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Foto.hasMany(models.Anchor)
      }
    }
  })
 
  return Foto
}