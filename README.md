# withBackbone
React Backbone Binding that works with React 16.0

# To install 
``` npm install with-backbone```

# To Use In Code
```
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
