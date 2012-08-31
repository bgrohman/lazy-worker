self.onmessage = function(e) {
    self.postMessage({
        msg: e.data,
        foo: 'bar'
    });
};
