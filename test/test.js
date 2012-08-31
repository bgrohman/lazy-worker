$(function() {
    test('the basics', function() {
        var worker;

        ok(Worker);
        ok(lazyWorker);
        ok(lazyWorker.Worker);
        ok(lazyWorker.exportWorker);

        lazyWorker.exportWorker();
        ok(Worker.lazy);

        worker = new Worker('workers/simple-test-worker.js');
        ok(worker);
        ok(worker.lazy);
        ok(worker.postMessage);
        ok(worker.terminate);
    });

    test('a basic worker', function() {
        var worker,
            messageReceived = false;

        lazyWorker.exportWorker();
        worker = new Worker('workers/simple-test-worker.js');

        ok(worker);
        ok(worker.lazy);
        equal(worker.constructor, Worker);

        worker.onmessage = function(msg) {
            messageReceived = true;
            equal(msg.data.foo, 'bar');
        };

        worker.postMessage('test');
        ok(messageReceived);
    });

    test('worker importScripts', function() {
        var worker,
            result;

        lazyWorker.exportWorker();
        worker = new Worker('workers/test-worker.js');

        ok(worker);
        ok(worker.lazy);

        worker.onmessage = function(msg) {
            result = msg.data;
        };

        worker.postMessage('test');

        equal(result.count, 1);
        equal(result.msg, 'test');
        equal(result.anImportedVar, 'foo');
        equal(result.anotherImportedVar, 'bar');
    });

    test('worker onerror', function() {
        var worker,
            capturedError = false;

        lazyWorker.exportWorker();
        worker = new Worker('workers/error-worker.js');

        worker.onerror = function(err) {
            capturedError = true;
            ok(err.type === 'error', 'ErrorEvent type is error');
            ok(err.message, 'error has a message');
        };

        worker.postMessage('foo');
        ok(capturedError);
    });
});
