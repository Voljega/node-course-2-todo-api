const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {User} = require('../../model/user');
const {Todo} = require('../../model/todo');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  email: 'mike@example.com',
  password: '56what!!',
  tokens: [{
    token: jwt.sign({_id: userOneId}, process.env.JSON_TOKEN_SECRET)
  }]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  email: 'roger@example.com',
  password: '56what!!Yo#',
  tokens: [{
    token: jwt.sign({_id: userTwoId}, process.env.JSON_TOKEN_SECRET)
  }]
};

const todoOne = {
  _id: new mongoose.Types.ObjectId(),
  text: 'First Task',
  owner: userOneId
}

const todoTwo = {
  _id: new mongoose.Types.ObjectId(),
  text: 'Second Task',
  completed: true,
  owner: userOneId
}

const todoThree = {
  _id: new mongoose.Types.ObjectId(),
  text: 'Third task',
  completed: true,
  owner: userTwo._id
}

const setupDb = async () => {
  await User.deleteMany();
  await Todo.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Todo(todoOne).save();
  await new Todo(todoTwo).save();
  await new Todo(todoThree).save();
};

module.exports = {userOneId, userOne, userTwoId, userTwo, setupDb, todoOne, todoTwo, todoThree};
