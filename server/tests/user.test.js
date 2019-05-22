const request = require('supertest');
const app = require('../app');
const {User} = require('../model/user');
const {userOneId, userOne, setupDb} = require('./fixtures/db');

beforeEach(setupDb);

test('Should sign up a new user', async () => {
  const response = await request(app).post('/users/').send({
    email:'toto@gmail.com',
    password: 'MyPass777!'
  }).expect(201);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: { email:'toto@gmail.com'},
    token: user.tokens[0].token
  });

  expect(user.password).not.toBe('MyPass777!');
});

test('Should login existing user', async () => {
  const response = await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  }).expect(200);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();
  expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login nonexistent user', async () => {
  await request(app).post('/users/login').send({
    email: userOne.email,
    password: 'ezae33||'
  }).expect(400);
});

test('Should fetch my user', async () => {
  await request(app).get('/users/me')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(200);
});

test('Should not fetch my user for unauthenticated user', async () => {
  await request(app).get('/users/me')
  .send()
  .expect(401);
});

test('Should delete account for user', async () => {
  const response = await request(app).delete('/users/me')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test('Should not delete my user for unauthenticated user', async () => {
  await request(app).delete('/users/me')
  .send()
  .expect(401);
});

test('Should upload avatar image', async () => {
  await request(app).post('/users/me/avatar')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .attach('avatar', 'server/tests/fixtures/profile-pic.jpg')
  .expect(200);

  const user = await User.findById(userOneId);
  //toBe uses triple equality -> toEqual
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user field', async () => {
  await request(app).patch('/users/me')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send({
    email: 'arya@winterfell.com'
  })
  .expect(200);

  const user = await User.findById(userOneId);
  expect(user.email).toBe('arya@winterfell.com');
});

test('Should not update invalid user field', async () => {
  await request(app).patch('/users/me')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send({
    location: 'Winterfell'
  })
  .expect(400);
});
