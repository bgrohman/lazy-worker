# lazy-worker

Lazy web workers only work when someone is watching - in the UI thread!

## Why?
IE<10 doesn't support [web workers](https://developer.mozilla.org/en-US/docs/DOM/Using_web_workers). By using a lazy-worker, you can code to the web workers spec even on IE. 

## Can I use this?
Since lazy-worker only overwrites the global `Worker` object if it doesn't already exist, lazy-worker can be used both in browsers that have native web worker support and those that don't. The global `Worker` object can be manually overridden by calling `lazyWorker.exportWorker()`. Alternatively, the `lazyWorker.Worker` constructor can be used directly to create lazy workers.

### Browser Support
* Chrome 21+
* Firefox 14+
* Safari 5+
* Opera 12+
* Internet Explorer 9+ 

### Running the Unit Tests
The test.html file needs to be hosted by a server and not open from the local file system. If you have ruby, run `ruby -r webrick -e "s = WEBrick::HTTPServer.new(:Port => 9090, :DocumentRoot => Dir.pwd); trap('INT') { s.shutdown }; s.start"` in the top level directory and open [http://localhost:9090/test/test.html](http://localhost:9090/test/test.html).

Alternatively, the tests can be run using the [grunt build tool](https://github.com/cowboy/grunt) command `grunt qunit`.

## Current Web Worker Functionality
* Creating workers
    * Both the `Worker` constructor and any lazy-worker instances will have a `lazy` property set to `true`
* Sending messages
    * Only the `onmessage` function is supported. lazy-worker might support the `addEventListener` method in the future.
* Loading scripts within workers using the `importScripts` function
* Error handling within workers using the `onerror` function
* Nested workers

### Example
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
