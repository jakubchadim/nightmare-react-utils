'use strict'

/**
 * Find all react elements by selector and return their values
 *
 * @param {String} selector
 * @param {Function} done
 * @return {Object|Array}
 */
const findAll = function (selector, done) {
  this.evaluate_now((selector) => {
    let elements = document.querySelectorAll(selector)
    if (!elements.length) {
      throw new Error('Unable to find react elements by selector: ' + selector)
    }

    elements = [].slice.call(elements) // Convert to array

    const reactElements = elements.map(element => {
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

    if (!reactElements.length) {
      throw new Error('Unable to find react elements by selector: ' + selector)
    }

    if (reactElements.length === 1) {
      return reactElements[0]
    }

    return reactElements
  }, done, selector)
}

module.exports = [
  'react',
  {
    findAll
  }
]
