/*
  Created by 'myth' on July 5. 2015

  CognacTime is licenced under the MIT licence.
*/

var util = require('./util')
var gen = require('./generator')

function registerEventHandlers(client) {

  if (client.DEBUG) console.log('Registering event handlers')

  function onMessage(data) {
    console.log('Received message: ' + util.repr(data))
  }
  client.registerEventHandler('message', onMessage)

  function onStats(data) {
    if (client.DEBUG) console.log('Received stats update: ' + util.repr(data))

    client.updateUserCount(data.users)
  }
  client.registerEventHandler('stats', onStats)

  function onVideo(data) {
    if (client.DEBUG) console.log('Received video object: ' + util.repr(data))

    gen.createVideoCard(data)
  }
  client.registerEventHandler('video', onVideo)
}

module.exports = registerEventHandlers
