/*
  Created by 'myth' on June 3. 2015

  CognacTime is licenced under the MIT licence.
*/

var ObjectToString = function (obj) {
  return JSON.stringify(obj, null, 4)
}

module.exports.repr = ObjectToString
