(function() {
    test('the basics', function() {
        ok(Worker);
        ok(lazyWorker);
        ok(lazyWorker.Worker);
        ok(lazyWorker.exportWorker);

        lazyWorker.exportWorker();
        ok(Worker.lazy);
    });
}());
