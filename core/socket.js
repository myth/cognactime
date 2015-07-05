/*
  Created by 'myth' on July 3. 2015

  CognacTime is licenced under the MIT licence.
*/

var log = require('./logging')
var util = require('../client/util')

// Start by defining the container object
function iowrapper (io) {

  this.connections = []
  this.io = io

  io.on('connection', function (socket) {
    log.info('Client connected: ' + socket.id)

    io.emit('stats', { users: io.engine.clientsCount })

    socket.on('message', function (data) {
      log.info('Received message: ' + data)
    })

    socket.on('fetch', function (data) {
      log.info('Received query: ' + util.repr(data))
    })

    socket.on('disconnect', function () {
      log.info('Client disconnected: ' + socket.id)
      io.emit('stats', { users: io.engine.clientsCount })
    })
  })
}

module.exports = iowrapper
