$(function() {
    test('the basics', function() {
        var worker;

        ok(Worker);
        ok(lazyWorker);
        ok(lazyWorker.Worker);
        ok(lazyWorker.exportWorker);

        lazyWorker.exportWorker();
        ok(Worker.lazy);

        worker = new Worker('simple-test-worker.js');
        ok(worker);
        ok(worker.lazy);
        ok(worker.postMessage);
        ok(worker.terminate);
    });

    test('a basic worker', function() {
        var worker,
            messageReceived = false;

        lazyWorker.exportWorker();
        worker = new Worker('simple-test-worker.js');

        ok(worker);
        ok(worker.lazy);
        equal(Worker, worker.constructor);

        worker.onmessage = function(msg) {
            messageReceived = true;
            equal('bar', msg.data.foo);
        };

        worker.postMessage('test');
        ok(messageReceived);
    });

    test('worker importScripts', function() {
        var worker,
            result;

        lazyWorker.exportWorker();
        worker = new Worker('test-worker.js');

        ok(worker);
        ok(worker.lazy);

        worker.onmessage = function(msg) {
            console.log('msg: ', msg.data);
            result = msg.data;
        };

        worker.postMessage('test');

        equal(result.count, 1);
        equal('test', result.msg);
        equal('foo', result.anImportedVar);
        equal('bar', result.anotherImportedVar);
    });
});
