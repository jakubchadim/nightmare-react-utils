# Nightmare react utils

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
  });
```

#### Available actions

All actions are in .react namespace

##### .findAll(selector)
Finds react elements and take their state, props and context.
Returns single or array of objects {state, props, context}
