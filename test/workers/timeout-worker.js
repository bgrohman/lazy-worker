self.count = 0;

self.onmessage = function(e) {
    setTimeout(function() {
        self.count += 1;

        self.postMessage({
            count: self.count
        });
    }, 1000);
};
