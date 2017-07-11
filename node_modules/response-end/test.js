
var request = require('request')
var http = require('http')
var responseEnd = require('./index')
var PORT = process.env.PORT || 1137

var server = http.createServer(handleRequest)

function handleRequest(req, res) {
  responseEnd(res)

  res.on('end', function() {
    console.log('All tests passed.')
  })

  res.end('bye!')
}

server.listen(PORT, function() {
  req()
})

function req() {
  request.get('http://localhost:' + PORT, function() { server.close() })
}
