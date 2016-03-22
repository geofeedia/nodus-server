'use strict';

// ** Constants
const SERVICE_NAME = 'pong';
const COMMANDS = {
    PING: 'PING'
};

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
    constructor(options) {
        super(SERVICE_NAME, options);

        // ** Handle PING requests
        this.handle_request(
            req => util.isString(req.command) && req.command.toUpperCase() === COMMANDS.PING,
            req => Promise.resolve(this.pong())
        );
    }

    pong() {
        logger.info('*********** PONG **********');
        return 'PONG';
    }
}

// ** Exports
module.exports = PongService;
module.exports.PongService = PongService;