const express = require('express');
var router = express.Router();
const controllerGet = require('../controller/get');
const controllerPost = require('../controller/post');
const upload = require('../multer/multer');

router.get('/', controllerGet.issues_get)

router.use('/add', upload.array('file', 10));
router.post('/add', controllerPost.issues_add);

module.exports = router;