self.childWorker = new Worker('workers/child-worker.js');
self.childWorker.onmessage = function(msg) {
    self.postMessage({
        foo: msg.data.foo
    });
};

self.onmessage = function(msg) {
    self.childWorker.postMessage({
        foo: msg.data.foo + ':parent'
    });
};
