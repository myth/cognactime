/*
  Created by 'myth' on July 5. 2015

  CognacTime is licenced under the MIT licence.
*/

var generator = (function () {
  /* Private fields */
  var results = $('#results')

  /* Private methods */

  /* Public methods */
  return {
    createVideoCard: function (data) {
      var html = '<div class="col s12 m4 l3">' +
          '<div class="videocard grey darken-3 grey-text text-lighten-2">' +
          '<div class="videocard-image">' +
          '<img src="' + data.image + '">' +
          '<span class="card-title truncate">' + data.title + '</span>' +
          '</div><div class="videocard-content">' +
          '<h5>' + data.runtime + ' minutes</h5>' +
          '<p>' + data.description + '</p>' +
          '</div><div class="videocard-action center">' +
          '<a href="' + data.uri + '">Play!</a></div></div></div>'

      html = $(html).hide()
      results.append(html)
      html.fadeIn(150)
    },

    createRow: function () {
      return $('<div class="row"></div>')
    }
  }
})()

module.exports = generator
