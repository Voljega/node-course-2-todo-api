var express = require('express');
var bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose.js');
const {userRouter} = require('./routers/user');
const {todoRouter} = require('./routers/todo');

var app = express();

app.use(bodyParser.json());
app.use(userRouter);
app.use(todoRouter);

module.exports = app;
