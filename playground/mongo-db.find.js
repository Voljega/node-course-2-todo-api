//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    console.log('Unable to connect to MongoDb Server');
  } else {
    console.log('Connected to MongoDB server');

    // db.collection('Todos').find({
    //   _id:new ObjectID('5b30cdf0528c7469f2ec5297')
    // }).toArray().then((docs) => {
    //   console.log('Todos');
    //   console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) =>{
    //   console.log('Unable to fetch data', err);
    // });

    db.collection('Users').find({
      name:'Tomtom'
    }).toArray().then((users) => {
      console.log('Users');
      console.log(JSON.stringify(users, undefined, 2));
    }, (err) =>{
      console.log('Unable to fetch data', err);
    });

    // db.collection('Todos').find().count().then((count) => {
    //   console.log(`Todos count:${count}`);
    // }, (err) =>{
    //   console.log('Unable to fetch data', err);
    // });

    // db.collection('Todos').insertOne({
    //   text:"'let's do something",
    //   completed: false
    // }, (err, result) =>{
    //   if (err) {
    //     console.log('Unable to insert todo');
    //   }
    //
    //   console.log(JSON.stringify(result.ops, undefined, 2));
    // })

    // db.collection('Users').insertOne({
    //   name:"Tomtom",
    //   age: 5
    // }, (err, result) =>{
    //   if (err) {
    //     console.log('Unable to insert user');
    //   }
    //
    //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    //
    // })


    //db.close();
  }
});
