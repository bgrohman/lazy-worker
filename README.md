#lazy-worker#

Lazy web workers only work when someone is watching - in the UI thread!

##Why?##
IE<10 doesn't support [web workers](https://developer.mozilla.org/en-US/docs/DOM/Using_web_workers). By using a lazy-worker, you can code to the web workers spec even on IE.

##Can I use this?##
Only if you're adventurous. It has been lightly tested with Chrome 21, Firefox 14, and Internet Explorer 9. 

##Current functionality##
* Creating workers
  * Both the `Worker` constructor and any lazy-worker instances will have a `lazy` property set to `true`   
* Sending messages
* Loading scripts within workers
* onerror support

### Example ###
```javascript
// In main.js
Worker.lazy; // true
var worker = new Worker('my-worker.js');
worker.lazy; // true

worker.onmessage = function(msg) {
  console.log(msg.data.foo);
};

worker.onerror = function(err) {
  console.log('Error: ', err.type, err.message);
};

worker.postMessage({
  foo: 'foo'
});
```

```javascript
// In my-worker.js
self.importScripts('my-helper-script.js');

self.onmessage = function(msg) {
  var foo = msg.data.foo + 'bar';
  
  self.postMessage({
    foo: foo
  });
};
```

## Running the Unit Tests ##
The test.html file needs to be hosted by a server and not open from the local file system. If you have ruby, run `ruby -r webrick -e "s = WEBrick::HTTPServer.new(:Port => 9090, :DocumentRoot => Dir.pwd); trap('INT') { s.shutdown }; s.start"` in the top level directory and open [http://localhost:9090/test/test.html](http://localhost:9090/test/test.html).

Alternatively, the tests can be run using the [grunt build tool](https://github.com/cowboy/grunt) command `grunt qunit`.