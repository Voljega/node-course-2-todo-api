//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    console.log('Unable to connect to MongoDb Server');
  } else {
    console.log('Connected to MongoDB server');

    // deleteMany
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
    //   console.log(result);
    // });

    // deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
    //   console.log(result);
    // });

    // findOneAndDelete
    db.collection('Users').findOneAndDelete({_id:new ObjectID('5b30d0a2a598856de2ec922b')}).then((result) => {
      console.log(result);
    });


    //db.close();
  }
});
