/*
  Created by 'myth' on July 9. 2015

  CognacTime is licenced under the MIT licence.
*/

var Transform = require('stream').Transform
var util =      require('util')

// Subclassing
util.inherits(ContentFilter, Transform)

/*
 * ConfigrationError is thrown when the options object passed to
 * the ContentFilter stream initializer is invalid or missing field
 *
 * @param message: A message string to be displayed
 */
function ConfigurationError(message) {
  Error.call(this)
  Error.captureStackTrace(this, arguments.callee)

  this.name = 'ConfigurationError'
  this.message = message
}

util.inherits(Error, ConfigurationError)

/*
 * ConfigrationError is thrown when the options object passed to
 * the ContentFilter stream initializer is invalid or missing field
 *
 * @param message: A message string to be displayed
 */
function ContentFilter(options) {
  // Allow use without 'new' keyword
  if (!(this instanceof ContentFilter)) {
    return new ContentFilter(options)
  }

  if (options.filters === undefined || options.filters === null) {
    throw new ConfigurationError('"filters" field not set')
  }

  this._filters = options.filters

  Transform.call(this, { objectMode: true })
}

ContentFilter.prototype._transform = function (obj, enc, cb) {
  var pass = true

  if (this._filters.runtime !== undefined) {
    if (obj.runtime < this._filters.runtime) pass = false
  }

  if (this._filters.query !== undefined) {
    pass = this._filters
               .query
               .toLowerCase()
               .split(' ')
               .indexOf(obj.category.toLowerCase()) >= 0
  }

  // Push the object back onto the stream if all good
  if (pass) this.push(obj)

  // Trigger callback
  cb()
}

module.exports = {
  ContentFilter: ContentFilter
}
