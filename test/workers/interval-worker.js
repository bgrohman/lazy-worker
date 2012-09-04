self.interval = null;
self.count = 0;

self.f = function() {
    self.count += 1;

    self.postMessage({
        count: self.count
    });
};

self.start = function() {
    self.interval = setInterval(self.f, 1000);
};

self.stop = function() {
    clearInterval(self.interval);
    self.interval = null;
};

self.onmessage = function(e) {
    switch (e.data.action) {
        case 'start':
            self.start();
            break;
        case 'stop':
            self.stop();
            break;
    }
};
