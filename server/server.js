var express = require('express');
var bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./model/todo');
const {User} = require('./model/user');

// var newUser = new User({
//   email: "roger@roger.com"
// });
//
// newUser.save().then((doc) => {
//   console.log('Saved User', doc);
// }, (err) =>{
//   console.log('Unable to save User', err);
// });

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text : req.body.text,
    completed : req.body.completed
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  })
});

app.listen(3333, () => {
  console.log('Started listening on port 3333');
})
