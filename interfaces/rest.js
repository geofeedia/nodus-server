'use strict';

// ** Constants
const DEFAULT_METHODS = ['GET'];

// ** Dependencies
const _ = require('underscore');
const PATH = require('path');
const restify = require('restify');
const path = require('path');

// ** Libraries
const Interface = require('../lib/Interface');

// ** Platform
const errors = require('nodus-framework').errors;
const logger = require('nodus-framework').logging.createLogger();

/**
 * Provides a RESTful HTTP interface
 */
class RestInterface extends Interface {
    constructor(options, config) {
        super(options, config);

        // ** Load configuration properties
        this.host = config.host;
        this.port = config.port;
        this.basePath = config.basePath;

        // ** Create HTTP Server
        this.api = restify.createServer({
            name: this.basePath
        });

        this.api.use(restify.dateParser());
        this.api.use(restify.queryParser());
        this.api.use(restify.bodyParser());
        this.api.use(restify.gzipResponse());
    }

    start() {
        logger.info('REST: Starting Http Listener...', {host: this.host, port: this.port});
        this.api.listen(this.port, this.host);

        super.start();
    }

    stop() {
        logger.info('REST: Stopping Http Listener...');
        this.api.close();

        super.stop();
    }

    registerEndpoint(path, options, command) {
        logger.info('PATH:', path);
        const api = this.api;
        const methods = options.methods || DEFAULT_METHODS;

        _.forEach(methods, method => {
            switch (method.toUpperCase()) {
                case 'GET':
                    api.get(path, (req, res, next) => {
                        logger.info('=> GET:', path);

                        const args = req.query;

                        // ** Run the command
                        command(args, (err, result) => {
                            if (err) {
                                res.send(500, {error: err});
                                next(err);
                            } else {
                                res.send(result);
                                next();
                            }
                        });
                    });
                    break;
                case 'POST':
                    throw errors('NOT_IMPLEMENTED');
                    break;
                default:
                    throw errors('NOT_SUPPORTED', {method: method});
                    break;
            }
        });
    }
}

// ** Exports
module.exports = RestInterface;
module.exports.RestInterface = RestInterface;