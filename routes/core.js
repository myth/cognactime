/*
  Created by 'myth' on June 30. 2015

  CognacTime is licenced under the MIT licence.
*/

var express = require('express')
var logger = require('morgan')
var bp = require('body-parser')
var router = express.Router()

// Base handler
router.use(bp.json({}))
router.use(bp.urlencoded({extended: false}))
router.route('/').get(function (req, res, next) {
  res.send('Wohoo, it works.')
}).post(function (req, res, next) {
  res.send('That does not work here.')
})

module.exports = router
