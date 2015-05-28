The AppSwitch component
-------------

> **Principles:**

> - Each component can define an asynchronous start/stop process
> - Order start/stop processes executions

Add the component to the boostraping configuration

<pre lang="javascript">
//index.js

'use strict';

var appjector = require('appjector');

appjector
  .container('./app', {
    'core' : {
      dependencies : {
      	// adding the appswitch component in the core module
        'appswitch' : appjector.AppSwitch
      }
    }
  })
  .run()

  // getting the appswitch instance
  .get('core').get('appswitch')

  // launch the start process
  .start(function(err) {
    if (err) {
      return console.log('app start failed');
    }

    console.log('app started');
  });
</pre>

then declare handlers in components

<pre lang="javascript">
'use strict';

module.exports = function(dep1, appswitch, dep2) {
	// as dep1 and dep2 are defined as dependencies 
	// their eventual start/stop handlers will be executed
	// before the ones below
	
	appswitch.onStart(function(callback) {
		...
	});
	
	appswitch.onStop(function(callback) {
		...
	});
}

</pre>

More informations about `appjector.AppSwitch` can be found [here](http://machard.github.io/appjector/appjector.AppSwitch.html)

----------------