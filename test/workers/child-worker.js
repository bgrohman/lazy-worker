self.onmessage = function(msg) {
    self.postMessage({
        foo: msg.data.foo + ':child'
    });
};
