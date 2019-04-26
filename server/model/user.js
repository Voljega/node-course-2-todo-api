var mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {Todo} = require('./todo');
const jsonTokenSecret = process.env.JSON_TOKEN_SECRET;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    minlength: 1,
    validate(value){
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    }
  },
  age: {
    type: Number,
    default:0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be positive')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true,
    validate(value){
      if (value.includes('password')) {
        throw new Error('Password is unsafe')
      }
    }
  },
  avatar: {
    type: Buffer
  },
  tokens: [{
    token : {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

// One to many
userSchema.virtual('todos', {
    ref: 'Todo',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({_id: user._id.toString()},jsonTokenSecret);
  user.tokens = user.tokens.concat({token});
  await user.save();
  return token;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
}

userSchema.statics.findByCredentials = async (email, password) => {
  console.log("ouaich");
  const user = await User.findOne({email});
  if (!user) {
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password,user.password);

  if (!isMatch) {
    throw new Error('Unable to login');
  }

  return user;
};

// Hashes password before saving
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password,8);
  }
  next();
});

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
  const user = this;
  await Todo.deleteMany({ owner: user._id});
  next();
})

var User = mongoose.model('User', userSchema);

module.exports = {User};
