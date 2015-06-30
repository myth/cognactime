/*
  Created by 'myth' on June 30. 2015

  CognacTime is licenced under the MIT licence.
*/

var fs, express, log, pkg, config, routes, ct, logstream, server;
fs = require('fs')
express = require('express')
log = require('./logging')
pkg = require('../package.json')
config = require('../config.json')
routes = require('../routes/core')
ct = express()

// Load the core routes
ct.use(require('morgan')('combined', {'stream': log.stream}))
ct.use('/', routes)

server = ct.listen(config.port, config.host, function () {

  var host = server.address().address
  var port = server.address().port

  log.info("CognacTime v%s running at %s:%s", pkg.version, host, port)

  log.debug("Test")
  log.error("Test")
  log.warn("Test")
})
