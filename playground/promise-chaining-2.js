require('../server/db/mongoose');
const {Todo} = require('../server/model/todo');

// Todo.findByIdAndRemove(('5b4dd4bf24d438234fe73336')).then((t) => {
//     console.log(t);
//     return Todo.count({completed: true});
// }).then((result) => {
//   console.log(result);
// }).catch((e) => {
//   console.log(e);
// });

const deleteAndCount = async (id) => {
  const todo = await Todo.findByIdAndRemove(id);
  const count = await Todo.count({completed: true});  
  return count;
};

deleteAndCount('5b4dc97ebee4fbad3c386795').then((count) => {
  console.log(count);
}).catch((e) => {
  console.log(e);
})
