//Import needed modules:
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const bodyParser = require('body-parser');

//Import routes:
const routes = require('./routes')


// ********** CREDENTIALS FOR MONGODB ATLAS **********

var user = 'pwp'
var pw = 'rest'
var collection = 'FAQ'
// ***************************************************

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to DB
mongoose.connect('mongodb+srv://' + user + ':' + pw + '@cluster-uj4xd.mongodb.net/' + collection + '?retryWrites=true', { useNewUrlParser: true })
 .then(() => console.log('MongoDB connected!'))
 .catch(err => console.log(err))

//Get routes from separate file
app.use('/api',routes);

//Server running and listening for port 1337
const server = async () => {
  try {
    await app.listen(1337)
    console.log("REST API Server running and listening port 1337!")
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}
server()