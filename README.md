#lazy-worker#

Lazy web workers only work when someone is watching - in the UI thread!

##Why?##
IE<10 doesn't support [web workers](https://developer.mozilla.org/en-US/docs/DOM/Using_web_workers). By using a lazy-worker, you can code to the web workers spec even on IE.

##Can I use this?##
No. It isn't finished.