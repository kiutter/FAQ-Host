var express = require('express');
var app = express();
const routes = require('./routes')

// Get the routes from a separate file
app.use('/api', routes);

//Server running and listening for port 1337
const server = async () => {
  try {
   await app.listen(1337, function () {
   
   console.log("REST API Server running and listening port 1337!")
  })
  } catch (err) {
	console.log.error(err)
    process.exit(1)
  }
}	
server()