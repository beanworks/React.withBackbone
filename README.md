# WithBackbone
**React Higher Order Component which will bind Backbone Data that works with React Fiber (v.16)**

[![NPM](https://nodei.co/npm/with-backbone.png)](https://nodei.co/npm/with-backbone/)


[![Code Climate](https://codeclimate.com/github/beanworks/withBackbone/badges/gpa.svg)](https://codeclimate.com/github/beanworks/withBackbone)
[![Test Coverage](https://codeclimate.com/github/beanworks/withBackbone/badges/coverage.svg)](https://codeclimate.com/github/beanworks/withBackbone/coverage)
![CI Status](https://travis-ci.org/beanworks/withBackbone.svg?branch=master)

## Why did we make it
There are already a couple of mixins or components that will link you Backbone model or collection with React, but with the introduction of [React Fiber (16.0)](https://facebook.github.io/react/blog/2017/04/07/react-v15.5.0.html), the `React.createClass` syntax will be deprecated which would suggest mixins are no longer a way to go, thus we've reinvented the wheel once again and created *withBackbone*.

## How does it work
The [higher order component](https://facebook.github.io/react/docs/higher-order-components.html) will loop through the props you passed in, and for each of those props who are either backbone model or backbone collection, it will be listen to certain events and `forceUpdate` if the events are triggered. Here is a table that summerizes the events that will trigger a `forceUpdate`:

| Backbone | Events |
| --- | --- |
| Model | Change|
| Collection | Add, Remove, Sort, Reset|

## To install 
``` npm install with-backbone```

## To Use In Code
```javascript
   import withBackbone from 'withBackbone';
   ...
   
   class TestClass extends React.Components {
   
    render () {
        return something that renders a backbone model or collection in props, for example user
     }
   }
   
   TestClass.PropTypes = {
      "User": PropTypes.instanceOf(Backbone.Model)
   }
   
   export default withBackbone(TestClass);

```

Now when your user changes, the view component re-render.
