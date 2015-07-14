/*
  Created by 'myth' on July 10. 2015

  CognacTime is licenced under the MIT licence.
*/

var request = require('request')
var pre =     require('../preprocessor')
var config =  require('../../config.json')
var log =     require('../../core/logging')
var util =    require('../../client/util')

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
function youtube(opts, cb) {
  OPTIONS.qs.q = 'documentary ' + opts.query
  if (opts.next) OPTIONS.qs.pageToken = opts.next

  log.debug("[YouTube] Performing request with opts: " + util.repr(OPTIONS))

  request.get(OPTIONS, function (err, res, body) {
    if (err) {
      log.error(body)
      return cb(err, body)
    }
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
        category: opts.query,
        runtime: 120,
        uri: 'https://youtube.com/watch?v=' + videos[v].id.videoId,
        meta: { youtubeNextPage: result.nextPageToken }
      }))
    }

    cb(null, payload)
  })
}

/*
 * The Client State object is used to keep track of current page token
 * for each individual client.
 */
var clientState = {}

module.exports = {
  youtube: youtube,
  clientState: clientState
}
