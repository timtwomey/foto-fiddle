var db = require('../models'),
    fs = require('fs'),
    http = require('http');

exports.all = function (req, res, next) {
  db.Foto.findAll({
    attributes: ['id', 'title', 'path', 'shortcode'],
  }).success( function (fotos) {
    res.send({"fotos": fotos});
  });
}

exports.one = function (req, res, next) {
  var i, anchors, anchorIds = [];

  db.Foto.find({
    where: {
      id: req.params.id
    },
    include: [{
      model: db.Anchor
    }]
  }).success( function (fotos) {

    anchors = fotos.anchors;

    for(i in anchors){
      anchorIds.push(anchors[i].id);
    }

    fotos.dataValues.anchors = anchorIds;
    
    res.send({
      "fotos": fotos,
      "anchors": anchors
    });
  });
}

exports.create = function (req, res) {

  var code = generateShortcode(4), 
      inPath,
      outPath,
      inStream, 
      outStream,
      onError,
      callbackHandled = false;

  inPath = req.files.foto.path;
  outPath =  '../../media/' + code + "-" + req.files.foto.name;
  inStream = fs.createReadStream( inPath );
  outStream = fs.createWriteStream( outPath );

  // file stream error handling
  onError = function(error) {
    if (!callbackHandled) {
      callbackHandled = true;
      res.send(error);
    }
  };
  inStream.on('error', onError);
  outStream.on('error', onError);

  // file stream end handler
  inStream.on('end', function() {
    outStream.end(function() {
      if (!callbackHandled) {
        callbackHandled = true;
        fs.unlink(inPath, function(err) {
          if (err) throw err;
          // return url to requester
          db.Foto.create({
            shortcode: code,
            title: req.files.foto.name,
            path: req.files.foto.name
          }).success(function (val) {
            res.send(val);
          });
        });
      }
    });
  });

  //trigger file transfer
  inStream.pipe(outStream, {end: false});
  
}

var generateShortcode = function (len) {
  var i, str = "",
      dict = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  if(!len){ len = 8; }
  
  for(i=0; i<len; i++){
    str += dict.charAt(Math.floor(Math.random() * dict.length));
  }
  return str;
}