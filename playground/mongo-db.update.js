//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    console.log('Unable to connect to MongoDb Server');
  } else {
    console.log('Connected to MongoDB server');

    db.collection('Todos').findOneAndUpdate({_id: new ObjectID('5b30cd3bf9fa7a68e3af2884')}, {
      $set: {
        completed : true
      }
    },{
      returnOriginal : false
    }).then((results) => {
      console.log(results)
    })

    //db.close();
  }
});
