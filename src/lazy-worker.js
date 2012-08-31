(function (globals, undefined) {
    function Worker() {
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
