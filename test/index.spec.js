'use strict'

const utils = require('../index')

describe('nightmare-react-utils', function () {
  it('should provide expected classes and constants', function () {
    expect(utils.Actions).to.be.an.array
  })
})
