const listHelper = require('../utils/list_helper')

// the test function has two parameters, a title string and a test case function.
test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})