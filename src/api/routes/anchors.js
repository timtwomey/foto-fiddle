var db = require('../models');

exports.all = function (req, res, next) {
  db.Foto.findAll({
    attributes: ['id', 'target', 'type', 'x', 'y']
  }).success( function (anchors) {
    res.send({"anchors": anchors});
  });
}

exports.one = function (req, res, next) {
  db.Foto.find({
    where: {
      id: req.params.id
    },
    attributes: ['id', 'target', 'type', 'x', 'y']
  }).success( function (anchors) {
    res.send({"fotos": anchors});
  });
}

exports.create = function (req, res) {
  console.log('anchor new');
  db.Foto.find({ 
    where: {
      id: req.body.foto_id
    }
  }).success( function (foto) {
    db.Anchor.create({
      target: req.body.target,
      type: req.body.type,
      x: req.body.x,
      y: req.body.y
    }).success( function (anchor) {
      anchor.setFoto(foto).success( function() {
        res.send(anchor);
      })
    })
  })   
}