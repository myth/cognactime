/*
  Created by 'myth' on July 10. 2015

  CognacTime is licenced under the MIT licence.
*/

var request = require('request')
var pre =     require('../preprocessor')
var config =  require('../../config.json')

// Youtube API endpoint
var ENDPOINT = 'https://www.googleapis.com/youtube/v3/search'

var OPTIONS = {
  uri: ENDPOINT,
  method: 'GET',
  qs: {
    maxResults: 50,
    videoEmbeddable: true,
    videoDefinition: 'high',
    videoDuration: 'long',
    type: 'video',
    part: 'snippet',
    key: config.credentials.youtube
  }
}

/*
 * The youtube function handles video queries to the youtube
 * API, and triggers a callback upon receiving a response.
 */
function youtube(query, cb) {
  OPTIONS.qs.q = 'documentary ' + query
  request.get(OPTIONS, function (err, res, body) {
    if (err) return cb(err, body)
    var result = JSON.parse(body)

    // Convert result items to Video objects
    var payload = []
    var videos = result.items
    for (var v in videos) {
      if (!videos.hasOwnProperty(v)) continue
      payload.push(new pre.Video({
        title: videos[v].snippet.title,
        description: videos[v].snippet.description,
        image: videos[v].snippet.thumbnails.medium.url,
        category: query,
        runtime: 120,
        uri: 'https://youtube.com/watch?v=' + videos[v].id.videoId
      }))
    }

    cb(null, payload)
  })
}

module.exports = youtube
