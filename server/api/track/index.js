'use strict';

var express = require('express');
var controller = require('./track.controller');

var router = express.Router();

router.post('/', controller.index);
router.get('/discover/:sort', controller.imvdb);

module.exports = router;
