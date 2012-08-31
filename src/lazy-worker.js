/*jslint evil: true*/
(function (globals, undefined) {

    /**
     * Constructor for new lazy-workers.
     * @param scriptUrl url of the script containing the worker source
     */
    function Worker(scriptUrl) {
        var self = this,
            wrapper;

        self.lazy = true;
        self.scriptSource = null;

        /**
         * Initializes the worker by eval-ing the worker's source.
         */
        function init() {
            fetchScript(scriptUrl, function(request) {
                evalWorkerScript(request.responseText);
            });
        }

        /**
         * Fetches the worker source synchronously for the given url and calls 
         * the provided function with the resulting XMLHttpRequest object.
         * @param url
         * @param f
         */
        function fetchScript(url, f) {
            var request = new XMLHttpRequest();

            request.open('GET', url, false);
            request.onload = function() {
                f(request);
            };
            request.send(null);
        }

        /**
         * Evals the given worker source string and sets up any worker-global
         * variables needed.
         * @param src
         */
        function evalWorkerScript(src) {
            self.scriptSource = src;
            // Make importScripts available to eval'ed code
            var importScripts = self.importScripts;

            try {
                eval(self.scriptSource);
            } catch (ex) {
                console.log('Error in worker script eval:', ex);
            }
        }

        /**
         * Posts a message to the main thread (the worker instance's onmessage
         * function in the case of lazy-worker).
         * @param msg
         */
        self.postMessage = function(msg) {
            var evt;

            if (typeof wrapper.onmessage === 'function') {
                evt = {
                    data: msg
                };
                wrapper.onmessage(evt);
            }
        };

        /**
         * Implementation of the web worker importScripts function that loads
         * scripts synchronously and evals them.
         * @param script one or more string urls
         */
        self.importScripts = function(script) {
            var scripts,
                i,
                len;

            if (arguments.length > 1) {
                scripts = arguments;
            } else {
                scripts = [script];
            }

            function handleRequest(request) {
                var scriptSource = request.responseText;
                try {
                    eval(scriptSource);
                } catch (ex) {
                    console.log('Error in importScripts script eval:', ex);
                }
            }

            for (i = 0, len = scripts.length; i < len; i++) {
                fetchScript(scripts[i], handleRequest);
            }
        };

        /**
         * Builds the wrapper object that will be returned by this constructor.
         * This is done so that the worker source can define the onmessage and
         * postMessage functions without overwriting the functions of the same
         * name defined on the worker instances.
         */
        function buildWrapper() {
            return {
                constructor: Worker,
                lazy: true,
                terminate: function() {
                },
                onmessage: function() {
                },
                postMessage: function(msg) {
                    var evt;

                    if (typeof self.onmessage === 'function') {
                        evt = {
                            data: msg
                        };
                        self.onmessage(evt);
                    }
                }
            };
        }

        // Build the wrapper, load the worker source, and return.
        wrapper = buildWrapper();
        init();
        return wrapper;
    }
    Worker.lazy = true;

    /**
     * Exports lazy-worker into the global scope.
     * This will replace the native Worker implementation if it exists.
     */
    function exportWorker() {
        globals.Worker = Worker;
    }

    if (!globals.Worker) {
        exportWorker();
    }

    globals.lazyWorker = {
        exportWorker: exportWorker,
        Worker: Worker
    };

}(window));
