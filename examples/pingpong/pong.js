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
        this.handle_request(
            req => req.command === 'ping',
            req => {
                // ** Read the request arguments and options.
                logger.info('ARGS:', req.args);
                logger.info('OPTIONS:', req.options);

                // ** Check if the --delay option was passed and if so, delay a specified number of milliseconds
                // ** before sending a 'PONG' reply.
                const delay = req.options.delay;
                return delay
                    ? new Promise((resolve, reject) => setTimeout(() => resolve('PONG'), parseInt(delay)))
                    : 'PONG'
            });
    }
}

// ** Exports
module.exports = PongService;
module.exports.PongService = PongService;
