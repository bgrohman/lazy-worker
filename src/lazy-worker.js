(function (globals, undefined) {

    function Worker(scriptUrl) {
        var self = this;
        self.lazy = true;

        self.postMessage = function(msg) {
        };

        self.terminate = function() {
        };
    }
    Worker.lazy = true;

    function exportWorker() {
        globals.Worker = Worker;
    }

    if (!Worker) {
        exportWorker();
    }

    globals.lazyWorker = {
        exportWorker: exportWorker,
        Worker: Worker
    };

})(window);
