/*
  Created by 'myth' on June 30. 2015

  CognacTime is licenced under the MIT licence.
*/

var express = require('express')
var pkg = require('../package.json')
var config = require('../config.json')
var routes = require('../routes/core')
var ct = express()

// Load the core routes
ct.use('/', routes)

var server = ct.listen(config.port, config.host, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("CognacTime v%s running at %s:%s", pkg.version, host, port)

})
