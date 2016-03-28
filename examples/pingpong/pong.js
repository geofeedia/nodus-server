'use strict';

// ** Dependencies
const util = require('util');

// ** Libraries
const Service = require('../../lib').Service;

// ** Platform
const logger = require('nodus-framework').logging.createLogger();

/**
 * Handles 'PING' messages with a 'PONG' reply
 */
class PongService extends Service {
    constructor(name, options) {
        super(name, options);

        // ** Handle PING requests
        this.process_request(
            req => req.command === 'ping',
            req => {
                // ** Read all the options and arguments passed in the request
                logger.info('ARGS:', this.__args);
                logger.info('OPTIONS:', this.__options);

                // ** Check if the --delay option was passed and if so, delay a specified number of milleseconds
                // ** before sending a 'PONG' reply.
                return options.delay
                    ? new Promise((resolve, reject) => setTimeout(() => resolve('PONG'), parseInt(options.delay)))
                    : 'PONG'
            });
    }
}

// ** Exports
module.exports = PongService;
module.exports.PongService = PongService;
