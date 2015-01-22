Unit tests
-------------

> **Principles:**

> - Isolation is made from the app container
> - Allow to isolate a module or a component

The component isolation is managed with `appjector.isolate`. you can find informations for this method [here](http://machard.github.io/appjector/appjector.html).


-------------------------

Given this organization

<img src="./img/container.examples/4.png" width="300"/>

-------------------------

Isolate a component
-------------

we want to isolate the `module1` `controller` which is defined as this :

<pre lang="javascript">
module.exports = function(auth, server, module2) {
    	//it uses auth, server and module2.get('model')
    	
    	return ...;
    }
</pre>

the solution is

<pre lang="javascript">
var isolatedController = appjector.isolate(appContainer, ['module1', 'controller'], {
	auth : authMock,

	server : serverMock,
	
	// mocking the module2
	module2 : appjector.container({
		// only model from module1 is used so no need to do more
		model : mockModel
	})
})
</pre>

Isolate module1
-------------
If we want to test module2 as a whole we need to mocks it's requirement. in this case they are `module1` and `server`.

<pre lang="javascript">
var isolatedModule = appjector.isolate(appContainer, ['module1'], {
	server : serverMock,
	
	// mocking the module
	module2 : appjector.container({
		model : mockModel,
		controller : mockController
	})
});
</pre>

Mock node modules
-------------
For the moment it consists to define them explicitely as dependencies in the main container so they can be mocked using `appjector.isolate`

<pre lang="javascript">
var appContainer = appjector.container('./app', {
	module1 : {
		dependencies : {
		    gcm : require('node-gcm')
		}
	}
});
</pre>