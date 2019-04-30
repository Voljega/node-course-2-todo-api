const {calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add} = require('../math');

test('Calculate Tip', () => {
  const total =  calculateTip(10, 0.3);
  expect(total).toBe(13);
});

test('Calculate Default Tip', () => {
  const total =  calculateTip(10);
  expect(total).toBe(12.5);
});

test('Should convert 32 F to 0 C', () => {
  const c = fahrenheitToCelsius(32);
  expect(c).toBe(0);
})

test('Should convert 0 C to 32 F', () => {
  const f = celsiusToFahrenheit(0);
  expect(f).toBe(32);
})

// test('Async test demo', (done) => {
//   setTimeout(() => {
//     expect(1).toBe(2);
//     done();
//   }, 2000);
// });

test('Test async add', (done) => {
    add(2,3).then((sum) => {
      expect(sum).toBe(5);
      done();
    })
});

test('Should add two numbers async/await', async () => {
  const sum = await add(22,10);
  expect(sum).toBe(32);
});
