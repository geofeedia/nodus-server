'use strict';

// ** Dependencies
const util = require('util');

// ** Libraries
const Command = require('../../lib').Command;
const Service = require('../../lib').Service;

/**
 * Handles 'PING' messages with a 'PONG' reply
 */
class PingService extends Service {
    constructor(name, options) {
        super(name, options);

        this.addCommand(new Command('send', {}, () => this.ping()));
    }

    ping() {
        logger.info('PING: ARGS', this.__args);

        // ** Handle PING requests
        return this.request('pong', 'ping');
    }
}

// ** Exports
module.exports = PingService;
module.exports.PingService = PingService;