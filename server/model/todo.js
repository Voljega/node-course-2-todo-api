var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const todoSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      minlength: 1,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      requires: true,
      ref: 'User'
    }
  }, {
    timestamps : true
  }
);

var Todo = mongoose.model('Todo', todoSchema);

// todoSchema.pre('save', async function (next) {
//   const todo = this;
//   if (user.isModified('password')) {
//     user.password = await bcrypt.hash(user.password,8);
//   }
//   next();
// })

module.exports = {Todo};
