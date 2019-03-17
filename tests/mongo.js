
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://pwp:rest@cluster-uj4xd.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  var doc = {name:"first", title:"first test"};
  const collection = client.db("test").collection("devices");
    client.collection("users").insertOne(doc, function(err, res) {
        if (err) throw err;
        console.log("Document inserted");
        // close the connection to db when you are done with it
        client.close();
    });


  client.close();
});
