'use strict';

// ** Dependencies
const restify = require('restify');

// ** Libraries
const Interface = require('../../lib/Interface');

// ** Platform
const errors = require('nodus-framework').errors;
const logger = require('nodus-framework').logging.createLogger();

/**
 * Provides a RESTful HTTP interface
 */
class RestInterface extends Interface {
    constructor(args, options, config) {
        super(args, options, config);

        // ** Load configuration properties
        this.host = config.host;
        this.port = config.port;
        this.basePath = config.basePath;

        // ** Create HTTP Server
        self.api = restify.createServer({
            name: self.basePath
        });

        this.api.use(restify.dateParser());
        this.api.use(restify.queryParser());
        this.api.use(restify.bodyParser({
            maxBodySize: 0,
            mapParams: true,
            mapFiles: false,
            hash: 'sha1'
        }));
        this.api.use(restify.gzipResponse());
    }

    start() {
        logger.info('REST: Starting Http Listener...', {host: self.host, port: self.port});
        this.api.listen(this.port, this.host);

        super.start();
    }

    stop() {
        logger.info('REST: Stopping Http Listener...');
        self.api.close();

        super.stop();
    }
}

// ** Exports
module.exports = RestInterface;
module.exports.RestInterface = RestInterface;