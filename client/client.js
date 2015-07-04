/*
  Created by 'myth' on June 30. 2015

  CognacTime is licenced under the MIT licence.
*/

var util = require('./util')

var client = (function () {
    /* Private fields */

    var host =  location.protocol + '//' + location.hostname +
                (location.port ? ':' + location.port : '')
    var socket;

    var testPayload = {'herp': 'derp'}

    /* Private methods */

    var connectToServer = function () {
      socket = io.connect(host)
      socket.on('connect', function () { console.log('Connected to server') })
      socket.on('message', function (data) {
        console.log('Received message: ' + util.repr(data))
      })
      socket.emit('message', JSON.stringify(testPayload))
    }

    /* Public methods */
    return {
      init: function () {
        console.log('Initializing CognacTime')

        var script = document.createElement('script')
        script.src = '/socket.io/socket.io.js'
        document.body.appendChild(script)

        script.onload = connectToServer
      }
    }
})()

client.init()
