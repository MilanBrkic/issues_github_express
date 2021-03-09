const express = require('express');
var router = express.Router();
const controllerGet = require('../controller/get');

router.get('/', controllerGet.issues_get)

module.exports = router;