const fastify = require('fastify')({
  logger: true
})
const routes = require('./routes')
const mongoose = require('mongoose')

// Connect to DB
mongoose.connect('mongodb+srv://pwp:rest@cluster-uj4xd.mongodb.net/test?retryWrites=true', { useNewUrlParser: true })
 .then(() => console.log('MongoDB connected…'))
 .catch(err => console.log(err))

// Loop over each route
routes.forEach((route, index) => {
  fastify.route(route)
})

//Server running and listening for port 1337

const server = async () => {
  try {
    await fastify.listen(1337)
    console.log("REST API Server running and listening port 1337!")
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}
server()