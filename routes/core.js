/*
  Created by 'myth' on June 30. 2015

  CognacTime is licenced under the MIT licence.
*/

var express = require('express')
var router = express.Router()

router.route('/').get(function (req, res) {
  res.send('Wohoo, it works.')
})

module.exports = router
