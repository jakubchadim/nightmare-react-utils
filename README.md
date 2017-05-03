# Nightmare react utils

Library which helps you to scrape data from react sites easily.

## Installation:

Using npm:
```bash
$ npm i --save nightmare-react-utils
```

## Actions:

#### Enhance nightmare
```javascript
const Nightmare = require('nightmare')
const Actions = require('nightmare-react-utils').Actions

Nightmare.action(...Actions)

Nightmare()
  .goto('http://your-react-site.com')
  .react.findAll('.item')
  .then(function(items) {
    //... do something with items values
  })
```

#### Available actions

All actions are in .react namespace

##### .exists(selector)
Check if exists react element with selector.
Returns `boolean`.

##### .find(selector)
Finds react elements and take his state, props and context.
Returns objects with `{state, props, context}`

##### .findAll(selector)
Finds react elements and take their state, props and context.
Returns array of objects `{state, props, context}`

##### .wait(selector[, callback|(path, value), timeout])
Waits for react element.

Usage:
```javascript
nightmare
  .react.wait('.react-element')
  .react.wait('.react-element', (values) => values.state.loaded)
  .react.wait('.react-element', 'state.name', 'Something')
  .react.wait('.react-element', 500)
  .then(function() {
    //... do something ...
  })
```