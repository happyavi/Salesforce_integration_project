/**
 * response-end
 *
 * Add an 'end' event to the http server response
 *
 * © 2012 Mike Frey <frey.mike@gmail.com>
 * MIT Licensed
 */

module.exports = responseEnd

function responseEnd(res) {
  if (res.end.proxied) return
  var old = res.end
  res.end = function() {
    res.end = old
    res.end.apply(res, arguments)
    res.emit('end')
  }
  res.end.proxied = true
}
