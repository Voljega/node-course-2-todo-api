const express = require('express');
const {User} = require('../model/user');
const auth = require('../middleware/auth');
const sharp = require('sharp');
const {sendWelcomeEmail, sendGoodbyeEmail} = require('../emails/account');

var userRouter = new express.Router();

userRouter.get('/test', (req,res) => {
  res.status(200).send('IHHHHAA');
});

userRouter.post('/users', async (req,res) => {
  var user = new User(req.body);
  try {
    await user.save();
    sendWelcomeEmail(user.email);
    const token = await user.generateAuthToken();
    res.status(201).send({user, token});
  } catch(e) {
    res.status(400).send(e);
  }
});

userRouter.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({user, token});
  } catch(e) {
    res.status(400).send(e);
  }
});

userRouter.post('/users/logout', auth, async(req,res) => {
  try{
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    });
    await req.user.save();
    res.send();
  } catch (e) {
    console.log(e);
    res.status(400).send();
  }
})

userRouter.post('/users/logoutAll', auth, async(req,res) => {
  try{
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    console.log(e);
    res.status(400).send();
  }
})

userRouter.get('/users/me', auth, async (req,res) => {
  res.send(req.user);
});

userRouter.delete('/users/me', auth, async (req,res) => {
  try {
    // const _id = req.user._id;
    // const user = await User.findByIdAndRemove(_id)
    // if (!user) {
    //   return res.status(404).send()
    // }
    await req.user.remove();
    sendGoodbyeEmail(req.user.email);
    res.status(200).send(req.user);
  } catch(e) {
    res.status(500).send();
  }
});

userRouter.patch('/users/me', auth, async(req,res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['email','password','age'];
  const isValidFields = updates.every((upd) => allowedUpdates.includes(upd));

  if (!isValidFields) {
    return res.status(400).send({error: 'Invalid fields !'});
  }

  try {

    if (!req.user) {
      return res.status(404).send();
    }

    updates.forEach((update) => req.user[update] = req.body[update]);
    await req.user.save();
    res.status(200).send(req.user);
  } catch(e) {
    console.log(e);
    res.status(400).send();
  }
});

const multer = require('multer');
const upload = multer({
  //dest: 'avatar',
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
      //https://regex101.com/
      if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('File must be jpg, jpeg, png'));
      } else {
        return cb(undefined, true);
      };
  }
})

userRouter.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res) => {
  //req.user.avatar = req.file.buffer;
  const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer();
  req.user.avatar = buffer;
  await req.user.save();
  res.send();
}, (error, req, res, next) => {
  res.status(400).send({error:error.message});
});

userRouter.delete('/users/me/avatar', auth, async (req,res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
}, (error, req, res, next) => {
  res.status(400).send({error:error.message});
});

userRouter.get('/users/:id/avatar', async (req,res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error('User or Avatar not found');
    }
    res.set('Content-Type','image/png');
    res.send(user.avatar);
  } catch (e) {
    res.status(400).send({error: e.message});
  }
});

module.exports = {userRouter};
