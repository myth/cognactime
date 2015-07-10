/*
  Created by 'myth' on July 3. 2015

  CognacTime is licenced under the MIT licence.
*/

var log = require('./logging')
var util = require('../client/util')
var pre = require('../lib/preprocessor')
var filter = require('../lib/contentfilter')
var youtube = require('../lib/sources/youtube')

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

      youtube(data.query === undefined ? "" : data.query, function (err, res) {
        if (err) return socket.emit('error', err)

        // Set up our source and filter streams
        var videoStream = new pre.VideoStream(res)
        var contentFilter = new filter.ContentFilter({
          filters: {
            query: data.query,
            runtime: data.runtime,
            torrents: data.torrents
          }
        })

        // Set up the WS emit
        contentFilter.on('readable', function () {
          var obj;
          while (null !== (obj = contentFilter.read())) {
            socket.emit('video', obj)
          }
        })

        // Start pi(m)pin'
        videoStream.pipe(contentFilter)
      })
    })

    socket.on('disconnect', function () {
      log.info('Client disconnected: ' + socket.id)
      io.emit('stats', { users: io.engine.clientsCount })
    })
  })
}

module.exports = iowrapper
