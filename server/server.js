var express = require('express');
var bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose.js');
const {userRouter} = require('./routers/user');
const {todoRouter} = require('./routers/todo');
const port= process.env.PORT;

var app = express();

app.use(bodyParser.json());
app.use(userRouter);
app.use(todoRouter);

app.listen(port, () => {  
  console.log('Started listening on port ' + port);
})
