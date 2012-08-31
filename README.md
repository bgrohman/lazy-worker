#lazy-worker#

Lazy web workers only work when someone is watching - in the UI thread!

##Why?##
IE<10 doesn't support [web workers](https://developer.mozilla.org/en-US/docs/DOM/Using_web_workers). By using a lazy-worker, you can code to the web workers spec even on IE.

##Can I use this?##
Only if you're adventurous. It has been lightly tested with Chrome 21, Firefox 14, and Internet Explorer 9. 

##Current functionality##
* Creating workers
* Sending messages
* Loading scripts within workers

### Example ###
```javascript
// In main.js
var worker = new Worker('my-worker.js');

worker.onmessage = function(msg) {
  console.log(msg.data.foo);
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

## Troubleshooting ##
###The unit test fails with SECURITY_ERR: DOM Exception 18###
See [this stackoverflow topic](http://stackoverflow.com/questions/2704929/uncaught-error-security-err-dom-exception-18) for details. You need to run this on a local server. If you have python, run `python -m SimpleHTTPServer` in the top level directory and open [http://localhost:8000/test/test.html](http://localhost:8000/test/test.html).
