/*
  Created by 'myth' on July 9. 2015

  CognacTime is licenced under the MIT licence.
*/

var Readable = require('stream').Readable
var util = require('util')

// Subclassing
util.inherits(VideoStream, Readable)
util.inherits(Video, Object)

/*
 * Video objects contains all video information as well as metadata
 * like where it came from etc.
 *
 * @param data The raw object data returned from API
 * @param type Type string representing which source it came from
 */
function Video(data, type) {
  // Allow use without 'new' keyword
  if (!(this instanceof Video)) {
    return new Video(data)
  }

  // TODO: Grab correct fields based on source object type

  this.title = data.title
  this.description = data.description
  this.image = data.image
  this.runtime = data.runtime
  this.category = data.category
  this.uri = data.uri
  this.meta = data.meta === undefined ? {} : data.meta
}

/*
 * VideoStream accepts an Array of Video objects and transforms it
 * into a Readable stream. This stream can be piped into a ContentFilter,
 * which is a Transform stream filtering out Video objects based on
 * the provided configuration
 *
 * @param data: An Array of video objects
 */
function VideoStream(data) {
  // Allow use without 'new' keyword
  if (!(this instanceof VideoStream)) {
    return new VideoStream(data)
  }

  if (!Array.isArray(data)) {
    throw new TypeError('Argument must be an Array')
  }

  Readable.call(this, { objectMode: true })

  this._videos = data
  this._index = 0
  this._end = data.length
}

VideoStream.prototype._read = function (size) {
  var vid = this._videos[this._index++]
  if (!(vid instanceof Video)) throw new TypeError('Array items must be Video')

  // If all OK, push Video to stream
  this.push(this._index < this._end ? vid : null)
}

module.exports = {
  VideoStream: VideoStream,
  Video: Video
}
