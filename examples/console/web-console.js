'use strict'

// ** Constants
const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 8080;

// ** Dependencies
const http_server = require('http-server');

// ** Libraries
const Service = require('../../lib/Service');

// ** Platform
const logger = require('nodus-framework').logging.createLogger();

class Console extends Service {
    constructor(name, options) {
        super(name, options);

        this.host = options.host || DEFAULT_HOST;
        this.port = options.port || DEFAULT_PORT;

        this.http_server = http_server.createServer({
            root: __dirname + '/web/',
            cors: true
        });
    }

    start() {

        // logger.warn('Starting HTTP Server...', {host: this.host, port: this.port});
        // this.http_server.listen(this.port, this.host);

        super.start();
    }
}

// ** Exports
module.exports = Console;
module.exports.Console = Console;