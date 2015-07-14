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
      log.debug('Received message: ' + data)
    })

    socket.on('fetch', function (data) {
      log.debug('Received query: ' + util.repr(data))

      var opts = {
        query: data.query === undefined ? "" : data.query,
        next: data.next === true ? youtube.clientState[socket.id] : false
      }

      // Make the API request with the current options
      youtube.youtube(opts, function (err, res) {
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

            // If the videos in the stream have a different nextPageToken
            // we need to update the clientState
            if (youtube.clientState[socket.id] !== obj.meta.youtubeNextPage) {
              youtube.clientState[socket.id] = obj.meta.youtubeNextPage
            }
          }
        })

        // Start pi(m)pin'
        videoStream.pipe(contentFilter)
      })
    })

    socket.on('disconnect', function () {
      log.info('Client disconnected: ' + socket.id)
      io.emit('stats', { users: io.engine.clientsCount })

      // Remove the nextPageToken from the youtube source client state
      delete youtube.clientState[socket.id]
    })
  })
}

module.exports = iowrapper
