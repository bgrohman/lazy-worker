#lazy-worker#

Lazy web workers only work when someone is watching - in the UI thread!

##Why?##
IE<10 doesn't support [web workers](https://developer.mozilla.org/en-US/docs/DOM/Using_web_workers). By using a lazy-worker, you can code to the web workers spec even on IE.

##Can I use this?##
No. It isn't finished.

##The unit test fails with SECURITY_ERR: DOM Exception 18##
See [this stackoverflow topic](http://stackoverflow.com/questions/2704929/uncaught-error-security-err-dom-exception-18) for details. You need to run this on a local server. If you have python, run `python -m SimpleHTTPServer` in the top level directory and open [http://localhost:8000/test/test.html](http://localhost:8000/test/test.html).
