Appjector
===================

*Appjector* is a simple lib that aims to **simplify dependencies management** and to **ease testing** for node projects

[![Build Status](https://travis-ci.org/machard/appjector.svg?branch=master)](https://travis-ci.org/machard/appjector)
[![Coverage Status](https://coveralls.io/repos/machard/appjector/badge.svg?branch=master)](https://coveralls.io/r/machard/appjector?branch=master)
[![npm version](https://badge.fury.io/js/appjector.svg)](http://badge.fury.io/js/appjector)
[![Dependency Status](https://david-dm.org/machard/appjector.svg)](https://david-dm.org/machard/appjector)
[![devDependency Status](https://david-dm.org/machard/appjector/dev-status.svg)](https://david-dm.org/machard/appjector#info=devDependencies)

> **Objectives:**

> - Dependency injection and localization
> - Limit duplication of declaration/naming
> - Allow asynchronous start/stop logic
> - Allow modular code organization
> - Allow easy files relocations
> - Allow easy unit and integration tests

----------

Bootstrap an application
-------------

```
//index.js

'use strict';

var appjector = require('appjector');

// create the app definition
var definition = new appjector.Definition();

// add components located in the app path
definition.path('./app');

// optionally add this helper component to deal with asynchronous start processes
definition.push(new appjector.Definition.Token(appjector.AppSwitch));

// create a container from the app definition
var appContainer = new appjector.Container(definition);

// instantiate every components
appContainer.instantiate();

// optionnaly launch async start processes
appContainer.get('appswitch').start(function(err) {
  if (err) {
    return console.log('app start failed');
  }

  console.log('app started');
});
```

----------

Component format
-------------

> **Principles:**

> - One component per file
> - A component exports an anonymous function
> - The function arguments define the required dependencies
> - The filename defines the component's name


**Classes** : the function will be called with **new**. A component is tagged so **if it has a prototype or if it's name start with an upper cased letter**.

```
// app/Class.js

'use strict';

exports = function(dep1, dep2, Dep3) {
	this.a = ...
};

exports.prototype.method = function() {
	...
};

```

**Factories** : the function explicitely **returns the component value**


```
// app/factory

'use strict';

exports = function(dep1, dep2, Dep3) {
	return {};
};

```

**Be aware** that **defining a component dependency** in function arguments **is case insentive**. 

This allows to **respect strict mode** : 

- **an instance** of a **Class** component needs to **have it's first letter lower cased**
- the **result** of a **factory returning a constructor** should **have it's first letter upper cased**

```
// assuming that other components are named Class
// and constructorFactory (function(){return Constructor;})

'use strict';

exports = function(class, ConstructorFactory) {
	// class is the instance of Class
	class.echo();
	
	// ConstructorFactory is the Constructor returned by constructorFactory
	var constructorFactoryInstance = new ConstructorFactory();
};
```

----------------


The AppSwitch component
-------------

> **Principles:**

> - Each component can define an asynchronous start/stop process
> - Order start/stop processes executions


```
'use strict';

exports = function(dep1, appSwitch, dep2) {
	// as dep1 and dep2 are defined as dependencies 
	// their eventual start/stop handlers will be executed
	// before the ones below
	
	appSwitch.onStart(function(callback) {
		...
	});
	
	appSwitch.onStop(function(callback) {
		...
	});
}

```

----------------


A word on testing
-------------

> **Objectives:**

> - Allow testing against the whole app
> - Allow testing of a single component
> - Allow to rapidly enable/disable mocking of components

```
describe('testing whole app', function() {
  var container;

  before(function(done) {
    // create a copy of appDefinition
    var def = new appjector.Definition(appDefinition);

    // mocking ComponentToMock by MockComponent
    def.replace(new appjector.Definition.Token(MockComponent, 'ComponentToMock'));

    // creating a new container
    container = new appjector.Container(def);

    // instantiate the whole partially mocked App
    container.instantiate();

    // optionally launch start processes
    container.get('appswitch').start(done);
  });

  it('should ...', function(done) {
    request(/*...*/);
  });

  after(function(done) {
    // optionnaly launch stop process in order to be back
    // at initial state
    container.get('appswitch').stop(done);
  });
});

describe('testing Component', function() {
  var component;

  beforeEach(function() {
    // create a copy of appDefinition
    var def = new appjector.Definition(appDefinition);

    // mocking ComponentToMock by MockComponent
    def.replace(new appjector.Definition.Token(MockComponent, 'ComponentToMock'));

    // creating a new container
    var container = new appjector.Container(def);

    // instantiate and get the tested component
    // MockComponent instance will be passed to Component
    // in place of ComponentToMock's one
    component = container.get('component');
  });

  it('should ...', function() {
    //...
  });

});
```
**Quick notes :**

This is intented to be an overview of how mocking and component isolation can be handled.

Tests organization should take advantage of appjector too, the very first component being the factory that returns the app definition :).


----------------

API
-------------
Full documentation can be seen [here](http://machard.github.com/appjector)

----------------

Coming next
-------------
- App example
- Possibility to define multiple components per file (exports.component1 = ...)
- Sub apps

----------------