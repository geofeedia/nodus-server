'use strict';

// ** Constants
const DEFAULT_METHODS = ['GET'];

// ** Dependencies
const util = require('util');
const _ = require('underscore');
const PATH = require('path');
const restify = require('restify');
const path = require('path');

// ** Libraries
const Interface = require('../lib/Interface');

// ** Platform
const errors = require('nodus-framework').errors;
const logger = require('nodus-framework').logger;
const LoggingContext = require('../lib/LoggingContext');

/**
 * Provides a RESTful HTTP interface
 */
class RestInterface extends Interface {
    constructor(name, options, config) {
        super(name, options, config);

        // ** Load configuration properties
        this.host = config.host;
        this.port = config.port;
        this.basePath = config.basePath;

        // ** Create HTTP Server
        this.api = restify.createServer({
            name: this.basePath
        });

        // CORS support
        this.api.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            return next();
        });
        this.api.use(restify.dateParser());
        this.api.use(restify.queryParser());
        this.api.use(restify.bodyParser());
        this.api.use(restify.gzipResponse());

        // this.api.use(restify.auditLogger({
        //     log: logger
        // }));

        // ** Map Nodus-Framework error codes to status codes
        const send_error = (res, next) => err => {
            if (typeof(err) == 'undefined') {
                return res.send(500, errors(500, 'Internal error - with no error :S').toObject());
            }
            if (!err.code) {
                return res.send(500, errors(500, 'Internal error', err).toObject());
            }
            if (err.code === 'NO_HANDLER') {
                res.send(404, err);
                // next(err);
            } else if (err.code > 0) {
                res.send(err.code, err);
                // err.statusCode = err.code;
                // next(err);
            } else {
                logger.error(err);
                res.send(500, err);
            }
        };

        // **
        const send_result = (res, next) => result => {
            res.send(result);
            next();
        };

        // ** Make a dynamic service request
        this.api.get('/:service/:command', (req, res, next) => {
            const service = req.params.service;
            const command = req.params.command;
            const args = req.query;

            // ** Make a dynamic service request
            this.request({
                service: service,
                command: command,
                args: args,
                options: {
                    loggingContext: new LoggingContext(req)
                }
            })
                .then(send_result(res, next))
                .catch(send_error(res, next))
        });

        // ** Make a dynamic service request
        this.api.post('/:service/:command', (req, res, next) => {
            const service = req.params.service;
            const command = req.params.command;
            const args = req.body;

            // ** Make a dynamic service request
            this.request({
                service: service,
                command: command,
                args: args,
                options: {
                    loggingContext: new LoggingContext(req)
                }
            })
                .catch(send_error(res, next))
                .then(send_result(res, next));
        });
    }

    start() {
        logger.debug('REST: Starting Http Listener...', {host: this.host, port: this.port});
        this.api.listen(this.port, this.host);

        super.start();
    }

    stop() {
        logger.debug('REST: Stopping Http Listener...');
        this.api.close();

        super.stop();
    }

    registerEndpoint(path, options, command) {
        return; // DEPRECIATED

        logger.debug('PATH:', path);
        const api = this.api;
        const methods = options.methods || DEFAULT_METHODS;

        _.forEach(methods, method => {
            switch (method.toUpperCase()) {
                case 'GET':
                    api.get(path, (req, res, next) => {
                        const url = req.url;
                        const args = req.query;

                        logger.debug('=> GET:', url, args);

                        // ** Run the command
                        command(args)
                            .catch(err => next(err))
                            .then(result => {
                                res.send(result);
                                next();
                            });
                    });
                    break;
                case 'POST':
                    api.post(path, (req, res, next) => {
                        const url = req.url;
                        const args = req.body;

                        logger.debug('=> POST:', url, args);

                        // ** Run the command
                        command(args, (err, result) => {
                            if (err) {
                                logger.error(err);
                                res.send(500, {error: err});
                                next(err);
                            } else {
                                res.send(result);
                                next();
                            }
                        });
                    });
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