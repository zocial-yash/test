const http = require('http');
const cluster = require('cluster');
const express = require('express');

const app = express();

if (cluster.isMaster) {
    _master();
} else {
    _worker();
}


async function _master() {
    let cores = 2;
    for (let i = 0; i < cores; i++) {
        cluster.setupMaster({
            args: [(i + 1).toString()]
        })
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log('Worker died (' + worker.process.pid + ')');
    });
}

async function _worker() {
    var workerNum = parseInt(process.argv[2]);
    console.log('Worker number ' + workerNum + ' started (' + process.pid + ')');
    try {
        let port = 4000 + workerNum - 1;
        let server = await http.createServer(app).listen(port, '0.0.0.0');
        console.log('Express server listening on port ' + port);
    } catch (e) {
        console.log(e);
    }
}