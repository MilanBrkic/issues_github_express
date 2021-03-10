const express = require('express');
var router = express.Router();
const controllerGet = require('../controller/get');
const controllerPost = require('../controller/post');
const controllerDelete = require('../controller/delete');
const upload = require('../multer/multer');

router.get('/', controllerGet.getAllIssues)

router.use('/add', upload.array('file', 10));
router.post('/add', controllerPost.addIssue);

router.delete('/delete', controllerDelete.deleteAll);

module.exports = router;