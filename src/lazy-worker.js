/*jslint evil: true*/ // Get off my back, Mr. Crockford. Lazy workers need eval.
(function (globals) {

    /**
     * Constructor for new lazy-workers.
     * @param scriptUrl url of the script containing the worker source
     */
    function Worker(scriptUrl) {
        var self = this,
            wrapper;

        self.lazy = true;

        /**
         * Constructor for ErrorEvent objects.
         * @param type a string representing the error type
         */
        function ErrorEvent(type) {
            this.type = type;
            this.bubbles = false;
            this.cancelBubble = false;
            this.cancelable = false;
            this.defaultPrevented = false;
            this.eventPhase = 0;
            this.filename = '';
            this.lineno = 0;
            this.returnValue = true;
            this.timestamp = (new Date()).getTime();
        }

        /**
         * Generates an ErrorEvent with the given message and calls the worker
         * wrapper's onerror function.
         * @param errorMessage
         */
        function handleError(errorMessage) {
            var errorEvent;

            if (typeof wrapper.onerror === 'function') {
                errorEvent = new ErrorEvent('error');
                errorEvent.message = errorMessage;
                wrapper.onerror(errorEvent);
            }
        }

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
            request.send();
        }

        /**
         * Evals the given worker source string and sets up any worker-global
         * variables needed.
         * @param src
         */
        function evalWorkerScript(src) {
            // Make importScripts available to eval'ed code
            var importScripts = self.importScripts;

            try {
                eval(src);
            } catch (ex) {
                handleError('Error in worker script: ' + ex.message);
            }
        }

        /**
         * Posts a message to the main thread (the worker instance's onmessage
         * function in the case of lazy-worker).
         * @param msg
         */
        self.postMessage = function(msg) {
            if (typeof wrapper.onmessage === 'function') {
                try {
                    wrapper.onmessage({data: msg});
                } catch (ex) {
                    handleError('Error on onmessage handler: ' + ex.message);
                }
            }
        };

        /**
         * Implementation of the web worker importScripts function that loads
         * scripts synchronously and evals them.
         * @param script one or more string urls
         */
        self.importScripts = function(script) {
            var scripts = arguments.length > 1 ? arguments : [script],
                i,
                len;

            function handleRequest(request) {
                var scriptSource = request.responseText;

                try {
                    eval(scriptSource);
                } catch (ex) {
                    handleError('Error in worker importScripts: ' + ex.message);
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
                terminate: function() {},
                onmessage: function() {},
                onerror: function() {},
                postMessage: function(msg) {
                    if (typeof self.onmessage === 'function') {
                        try {
                            self.onmessage({data: msg});
                        } catch (ex) {
                            handleError('Error in worker onmessage: ' + ex.message);
                        }
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
