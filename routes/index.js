var express = require('express');
var router = express.Router();
const faceapp = require('faceapp');
var fs = require('fs');

//multer object creation
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });
/* GET home page. */
router.get('/', async function(req, res, next) {
  var filteroption = await faceapp.listFilters();
  res.render('index', { title: 'Face-app', opts: filteroption });
});

router.post('/', upload.single('imageupload'), function(req, res) {
  const file = req.file;
  const filename =
    file.path.substring(0, file.path.lastIndexOf('.') - 1) +
    `_${req.body.filter}.` +
    file.path.substring(file.path.lastIndexOf('.') + 1);
  if (fs.existsSync(filename)) {
    res.contentType('image/png');
    res.send(fs.readFileSync(filename));
  } else {
    faceapp
      .process(req.file.path, req.body.filter)
      .then(image => {
        res.contentType('image/png');
        res.send(image);
        fs.writeFileSync(filename, image);
      })
      .catch(err => {
        console.log(err);
      });
  }
});

module.exports = router;
