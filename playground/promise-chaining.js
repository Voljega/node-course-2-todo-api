require('../server/db/mongoose');
const {User} = require('../server/model/user');

//5cb5af553e46a92049c30afc

// User.findByIdAndUpdate('5cb5af553e46a92049c30afc', { age: 103})
// .then((user) => {
//   console.log(user);
//   return User.count({age: 103});
// }).then((result) => {
//   console.log(result);
// }).catch((e) => {
//   console.log(e);
// });

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, {age});
  const count = await User.count({age});
  return count;
};

updateAgeAndCount('5cb5af553e46a92049c30afc', 101)
.then((count) => {
  console.log(count);
}).catch((e) => {
  console.log(e);
});
