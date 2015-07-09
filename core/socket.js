/*
  Created by 'myth' on July 3. 2015

  CognacTime is licenced under the MIT licence.
*/

var log = require('./logging')
var util = require('../client/util')
var pre = require('../lib/preprocessor')
var filter = require('../lib/contentfilter')

// Start by defining the container object
function iowrapper (io) {

  this.connections = []
  this.io = io

  var videoMockup = [
    {
      image: 'http://www.catsaroundtheglobe.com/wp-content/uploads/africancats2.jpg',
      title: 'Wild Africa (2014)',
      runtime: 57,
      description: "Join Fred Masterson on a safari through the african plains. " +
                   "The big cats of Africa have never before been filmed in such " +
                   "a remarkable way, casting light on their quite social beaviour.",
      category: 'nature'
    },
    {
      image: 'http://static01.nyt.com/images/2013/02/21/arts/onelife1/onelife1-articleLarge.jpg',
      title: 'The Northern Seals with Marc Hamilton',
      runtime: 49,
      description: "Join Marc Hamilton on his adventures in the polar regions. " +
                   "Witness the remarkable baby seals before they are violently " +
                   "clubbed to death by teenagers drunk and high on gasoline.",
      category: 'nature'
    }
  ]

  io.on('connection', function (socket) {
    log.info('Client connected: ' + socket.id)

    io.emit('stats', { users: io.engine.clientsCount })

    socket.on('message', function (data) {
      log.info('Received message: ' + data)
    })

    socket.on('fetch', function (data) {
      log.info('Received query: ' + util.repr(data))
      for (var i in videoMockup) {
        if (videoMockup.hasOwnProperty(i)) {
          if (data.runtime <= videoMockup[i].runtime &&
              data.filter === videoMockup[i].category) {
            socket.emit('video', videoMockup[i])
          }
        }
      }
    })

    socket.on('disconnect', function () {
      log.info('Client disconnected: ' + socket.id)
      io.emit('stats', { users: io.engine.clientsCount })
    })
  })
}

module.exports = iowrapper
