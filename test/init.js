'use strict'

const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
chai.use(sinonChai)

global.expect = chai.expect
global.spy = sinon.spy
global.createStubInstance = sinon.createStubInstance
global.useFakeTimers = sinon.useFakeTimers

console.log('Mocha test initialized ✓')
