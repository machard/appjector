Appjector
===================

*Appjector* is a simple lib that aims to **simplify dependencies management** and to **ease testing** for **modular** node projects

[![Build Status](https://travis-ci.org/machard/appjector.svg?branch=master)](https://travis-ci.org/machard/appjector)
[![Coverage Status](https://coveralls.io/repos/machard/appjector/badge.svg?branch=master)](https://coveralls.io/r/machard/appjector?branch=master)
[![npm version](https://badge.fury.io/js/appjector.svg)](http://badge.fury.io/js/appjector)
[![Dependency Status](https://david-dm.org/machard/appjector.svg)](https://david-dm.org/machard/appjector)
[![devDependency Status](https://david-dm.org/machard/appjector/dev-status.svg)](https://david-dm.org/machard/appjector#info=devDependencies)

![cover](./img/cover.png)

----------

Bootstrap an application
-------------

the simple way

<pre lang="javascript">
//index.js

'use strict';

var appjector = require('appjector');

appjector
  .container('./app')
  .run();

</pre>


----------


File format
-------------

> **Principles:**

> - The filename defines the component's name
> - Exports an anonymous function
> - The function arguments define the required dependencies
> - The function returns the component's value


<pre lang="javascript">
'use strict';

module.exports = function(dep1, dep2, Dep3) {)
	return {} // or Class, [], 'hello', fn ...;
};
</pre>

----------------


Defining modules
-------------

Have a look at how `appjector.container` works [here](http://github.com/machard/appjector/blob/master/appjector.container.md)

----------------


Add asynchronous start/stop logics
-------------

Have a look at how `appjector.AppSwitch` helper works [here](http://github.com/machard/appjector/blob/master/appjector.AppSwitch.md)

----------------


How to unit test
-------------

Have a look at how `appjector.isolate` works [here](http://github.com/machard/appjector/blob/master/appjector.isolate.md)


----------------


More
-------------
- Full documentation can be seen [here](http://machard.github.com/appjector)
- Backlog can be seen [here](http://github.com/machard/appjector/blob/master/backlog.md)

----------------