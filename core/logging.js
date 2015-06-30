/*
  Created by 'myth' on June 30. 2015

  CognacTime is licenced under the MIT licence.
*/

var winston = require('winston')
var config = require('../config.json')

winston.emitErrs = true;

var logConf = {
  transports: []
}

if (config.logging.file) {
  logConf.transports.push(
    new winston.transports.File({
      level: config.logging.fileLevel,
      filename: config.logging.filePath,
      handleExceptions: false,
      json: false,
      maxSize: 5242880,
      maxFiles: 5,
      colorize: false
    })
  )
}
if (config.logging.console) {
  logConf.transports.push(
    new winston.transports.Console({
      level: config.logging.consoleLevel,
      handleExceptions: false,
      json: false,
      colorize: true
    })
  )
}

var logger = new winston.Logger(logConf)

module.exports = logger
module.exports.stream = {
  write: function (msg, enc) {
    logger.info(msg)
  }
}
