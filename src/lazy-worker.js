/*jslint evil: true*/
(function (globals, undefined) {

    function Worker(scriptUrl) {
        var self = this,
            wrapper = {};

        self.lazy = true;
        self.scriptSource = null;

        function init() {
            fetchScript(scriptUrl, function(request) {
                evalWorkerScript(request.responseText);
            });
        }

        function fetchScript(url, f) {
            var request = new XMLHttpRequest();

            request.open('GET', url, false);
            request.onload = function() {
                f(request);
            };
            request.send(null);
        }

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

        self.postMessage = function(msg) {
            var evt;

            if (typeof wrapper.onmessage === 'function') {
                evt = {
                    data: msg
                };
                wrapper.onmessage(evt);
            }
        };

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

        init();

        wrapper.constructor = Worker;
        wrapper.lazy = true;
        wrapper.terminate = function() {
        };
        wrapper.onmessage = function() {
        };
        wrapper.postMessage = function(msg) {
            var evt;

            if (typeof self.onmessage === 'function') {
                evt = {
                    data: msg
                };
                self.onmessage(evt);
            }
        };
        return wrapper;
    }
    Worker.lazy = true;

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
