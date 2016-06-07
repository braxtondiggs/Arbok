'use strict';

var express = require('express');
var controller = require('./artist.controller');

var router = express.Router();

router.get('/id/:id', controller.id);
router.get('/slug/:id', controller.slug);
router.get('/bio/:slug', controller.bio);
router.get('/related/:slug', controller.related);

module.exports = router;