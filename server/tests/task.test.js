const request = require('supertest');
const app = require('../app');
const {Todo} = require('../model/todo');
const {userOneId, userOne, userTwoId, userTwo, setupDb, todoOne, todoTwo, todoThree} = require('./fixtures/db');

beforeEach(setupDb);

test('Should create todo for user', async () => {
  const response = await request(app)
  .post('/todos')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send({text:'Blablabla'})
  .expect(201);
  const todo = await Todo.findById(response.body._id);
  expect(todo).not.toBeNull();
  expect(todo.completed).toBe(false);
});

test('Should fetch todo for user', async () => {
  const response = await request(app)
  .get('/todos')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .expect(200);

  expect(response.body).not.toBeNull();
  expect(response.body.length).toBe(2);
});

test('Should not delete todo for another user', async () => {
  const response = await request(app)
  .delete(`/todos/${todoOne._id}`)
  .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
  .expect(404);

  const todo = await Todo.findById(todoOne._id);
  expect(todo).not.toBeNull();
})
