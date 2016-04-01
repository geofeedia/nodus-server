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
                logger.info('ARGS:', req.args);
                logger.info('OPTIONS:', req.options);

                const delay = req.options.delay;

                // ** Check if the --delay option was passed and if so, delay a specified number of milliseconds
                // ** before sending a 'PONG' reply.
                return delay
                    ? new Promise((resolve, reject) => setTimeout(() => resolve('PONG'), parseInt(delay)))
                    : 'PONG'
            });
    }
}

// ** Exports
module.exports = PongService;
module.exports.PongService = PongService;
