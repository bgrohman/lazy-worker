self.importScripts('test-import-script.js');
importScripts('test-import-script2.js');

self.count = 0;

self.onmessage = function(e) {
    self.count += 1;
    self.postMessage({
        count: self.count,
        msg: e.data,
        anImportedVar: anImportedVar,
        anotherImportedVar: anotherImportedVar
    });
};
