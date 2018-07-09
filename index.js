const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

// Start the http server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

// Start the https server

const httpsServerOptions = {
  'key': '',
  'cert': ''
}
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
});


// listen on specific port

httpServer.listen(config.httpPort, () => {
  console.log('server listening on port', config.httpPort );
});
httpsServer.listen(config.httpPort, () => {
  console.log('server listening on port', config.httpsPort );
});

// All server logic for both http and https
const unifiedServer = (req, res) => {
  // Parse the url to get which resource user is asking for
  const parsedUrl =  url.parse(req.url, true);

  const path = parsedUrl.pathname;

  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  
  // Get the http method

  const queryStringObject = parsedUrl.query;

  // Get the headers

  const headers = req.headers;

  const decoder = new StringDecoder('utf-8');

  var buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  // will always be called even if there is no req body
  req.on('end', () => {
    buffer += decoder.end();
    // Choose the handler for the request. If request is not found then choose 404 handler.
      var chosenHandler = router[trimmedPath] != undefined ? router[trimmedPath] : handlers.notFound;

      // Construct the data object to sendto the handler.

      var data = {
        'trimmedPath' : trimmedPath,
        'queryStringObject': queryStringObject,
        'method': req.method.toLowerCase(),
        'headers': headers,
        'payload': buffer
      }
      
      // Route the request to the handler specified in the router.

      chosenHandler(data, (statusCode, response) => {
        // Use the status code called by the handler or default 200
          statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
        
        // Use the payload called by the handler or default to an empty object

        payload = typeof(response) === 'object' ? response : {};

        // Convert to a string
        var payloadString = JSON.stringify(payload);

        res.setHeader('Content-Type', 'application/json')
        res.writeHead(statusCode);
        res.end(payloadString);
      });
  });
}

// Define the handlers

const handlers = {}

handlers.sample = ((data, cb) => {
  // Callback a http status code and a payload object
  console.log('got this data', data);
  cb(406, {'name': 'Sample handler'});
});

handlers.notFound = ((data, cb) => {
  cb(404)
})

// Define a request router
const router = {
  'sample': handlers.sample
}