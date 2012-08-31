(function() {
    test('the basics', function() {
        ok(Worker);
        ok(lazyWorker);
        ok(lazyWorker.Worker);
        ok(lazyWorker.exportWorker);

        lazyWorker.exportWorker();
        ok(Worker.lazy);
    });

    test('worker functions', function() {
        var worker = new Worker('test-worker.js');
        ok(worker);
        ok(worker.lazy);
        ok(worker.postMessage);
        ok(worker.terminate);
    });
}());
