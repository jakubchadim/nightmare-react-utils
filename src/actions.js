'use strict'

const sliced = require('sliced')
const _get = require('lodash.get')

/**
 * Check if react element exists
 *
 * @param {String} selector
 * @param {Function} done
 * @return {Boolean}
 */
const exists = function (selector, done) {
  this.evaluate_now((selector) => {
    let element = document.querySelector(selector)
    if (!element) {
      return false
    }

    for (let key in element) {
      if (key.startsWith('__reactInternalInstance$')) {
        return true
      }
    }

    return false
  }, done, selector)
}

/**
 * Find react element by selector and return his values
 *
 * @param {String} selector
 * @param {Function} done
 * @return {{state: Object, props: Object, context: Object}}
 */
const find = function (selector, done) {
  this.evaluate_now((selector) => {
    let element = document.querySelector(selector)
    if (!element) {
      return null
    }

    for (let key in element) {
      if (key.startsWith('__reactInternalInstance$')) {
        const compInternals = element[key]._currentElement
        const compWrapper = compInternals._owner
        const {props, state, context} = compWrapper._instance
        return {
          props,
          state,
          context
        }
      }
    }

    return null
  }, done, selector)
}

/**
 * Find all react elements by selector and return their values
 *
 * @param {String} selector
 * @param {Function} done
 * @return {Array}
 */
const findAll = function (selector, done) {
  this.evaluate_now((selector) => {
    let elements = document.querySelectorAll(selector)
    if (!elements.length) {
      return []
    }

    elements = [].slice.call(elements) // Convert to array

    return elements.map(element => {
      for (let key in element) {
        if (key.startsWith('__reactInternalInstance$')) {
          const compInternals = element[key]._currentElement
          const compWrapper = compInternals._owner
          const {props, state, context} = compWrapper._instance
          return {
            props,
            state,
            context
          }
        }
      }
    }).filter(e => e != null)
  }, done, selector)
}

/**
 * Wait
 *
 * @param {...} args
 */
const wait = function () {
  let args = sliced(arguments)
  let done = args[args.length - 1]
  if (args.length < 2) {
    // not enought params
    return done()
  }

  let selector = args[0]
  if (typeof selector === 'string') {
    let callback = args[1]
    let timeout = null

    if (typeof callback === 'string') {
      let shouldBe = null

      if (typeof args[2] !== 'function') {
        shouldBe = args[2]
      }

      if (typeof args[3] === 'number') {
        timeout = args[3]
      }

      callback = (element) => _get(element, args[1]) === shouldBe
    } else if (typeof args[1] === 'number') {
      timeout = args[1]
    }

    if (args.length < 3) {
      callback = null
    }

    waitelem.apply({ timeout, callback }, [this, selector, done])
  } else {
    done()
  }
}

/**
 * Wait until evaluated function returns true.
 *
 * @param {Nightmare} self
 * @param {Function} fn
 * @param {...} args
 * @param {Function} done
 */
function waitfn () {
  const softTimeout = this.timeout || null
  const callback = this.callback
  let executionTimer
  let softTimeoutTimer
  let self = arguments[0]

  let args = sliced(arguments)
  let done = args[args.length - 1]

  let timeoutTimer = setTimeout(function () {
    clearTimeout(executionTimer)
    clearTimeout(softTimeoutTimer)
    done(new Error(`.wait() timed out after ${self.options.waitTimeout}msec`))
  }, self.options.waitTimeout)
  return tick.apply(this, arguments)

  function tick (self, fn) {
    if (softTimeout) {
      softTimeoutTimer = setTimeout(function () {
        clearTimeout(executionTimer)
        clearTimeout(timeoutTimer)
        done()
      }, softTimeout)
    }

    let waitDone = function (err, result) {
      if (callback) {
        result = callback(result)
      }
      if (result) {
        clearTimeout(timeoutTimer)
        clearTimeout(softTimeoutTimer)
        return done()
      } else if (err) {
        clearTimeout(timeoutTimer)
        clearTimeout(softTimeoutTimer)
        return done(err)
      } else {
        executionTimer = setTimeout(function () {
          tick.apply(self, args)
        }, self.options.pollInterval)
      }
    }
    let newArgs = [fn, waitDone].concat(args.slice(2, -1))
    self.evaluate_now.apply(self, newArgs)
  }
}

/**
 * Wait for a specified selector to exist.
 *
 * @param {Nightmare} self
 * @param {String} selector
 * @param {Function} done
 */
function waitelem (self, selector, done) {
  let elementPresent
  eval('elementPresent = function() {' + // eslint-disable-line
    `  var element = document.querySelector('${selector}');` +
    '  if (!element) { return null }' +
    '  for (let key in element) {' +
    '    if (key.startsWith(\'__reactInternalInstance$\')) {' +
    '      const compInternals = element[key]._currentElement;' +
    '      const compWrapper = compInternals._owner;' +
    '      const {props, state, context} = compWrapper._instance;' +
    '      return {props, state, context}' +
    '    }' +
    '  }' +
    '  return null;' +
    '}')
  waitfn.apply(this, [self, elementPresent, done])
}

module.exports = [
  'react',
  {
    exists,
    wait,
    find,
    findAll
  }
]
