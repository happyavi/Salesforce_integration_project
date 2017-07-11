# response-end

Proxies the end method of a http.ServerResponse instance to fire
an `end` event after the original method is called.

Hopefully a similar event will be provided in node 0.9+. At which
point this module will be mostly useless.

### Installation

    npm install response-end

### Usage

    var responseEnd = require('response-end')
    var http = require('http')

    var server = http.createServer(handleRequest)

    function handleRequest(req, res) {
      responseEnd(res)

      res.on('end', function() {
        console.log('The response ended')
      })

      res.end('bye!')
    }

    server.listen(1137)
