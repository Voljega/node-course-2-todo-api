const express = require('express');
const {Todo} = require('../model/todo');
const auth = require('../middleware/auth');
var todoRouter = new express.Router();

todoRouter.post('/todos', auth, async (req, res) => {
  try {
    var todo = new Todo({
      ...req.body, // copies all properties of req.body
      owner: req.user._id
    });
    const doc = await todo.save();
    res.status(201).send(doc);
  } catch(e) {
    res.status(400).send(e);
  }
});

// GET /todos?completed=false
// GET /todos?limits=10&skip=0
// GET /todos?sortBy=createdAt_desc
todoRouter.get('/todos', auth, async (req,res) => {
  try {
    const match = {};
    const sort = {};
    if (req.query.completed) {
      match.completed = req.query.completed === 'true';
    }

    if (req.query.sortBy) {
      const parts = req.query.sortBy.split('_');
      // set object like sort: { completed:1 } for ?sortBy=completed_asc
      sort[parts[0]] = (parts[1] === 'desc') ? -1 : 1;
    }

    await req.user.populate({
      path:'todos',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate();
    res.status(200).send(req.user.todos);
  } catch(e) {
    console.log(e);
    res.status(500).send();
  }
});

todoRouter.get('/todos/:id', auth, async (req,res) => {
  try {
    const _id = req.params.id;
    // only tasks of auth user
    const todo = await Todo.findOne({_id, owner: req.user._id});
    if (!todo) {
      return res.status(404).send();
    }
    res.status(200).send(todo);
  } catch(e) {
    res.status(500).send();
  }
});

todoRouter.patch('/todos/:id', auth, async (req,res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['text','completed'];
  const isValidFields = updates.every((upd) => allowedUpdates.includes(upd));

  if (!isValidFields) {
    return res.status(400).send({error: 'Invalid fields !'});
  }

  try {
    const _id = req.params.id;
    const todo = await Todo.findOne({_id, owner: req.user._id});

    if (!todo) {
      return res.status(404).send();
    }

    updates.forEach((update) => todo[update] = req.body[update]);
    await todo.save();

    res.status(200).send(todo);
  } catch(e) {
    res.status(400).send(e);
  }
});

todoRouter.delete('/todos/:id', auth, async (req,res) => {
  try {
    const _id = req.params.id;
    const todo = await Todo.findOne({_id, owner: req.user._id});
    if (!todo) {
      return res.status(404).send()
    }

    todo.remove();
    res.status(200).send(todo);
  } catch(e) {
    res.status(500).send();
  }
});

module.exports = {todoRouter};
