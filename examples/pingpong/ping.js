'use strict';

// ** Constants
const SERVICE_NAME = 'ping';

// ** Dependencies
const util = require('util');

// ** Libraries
const Command = require('../../lib').Command;
const Service = require('../../lib').Service;

/**
 * Handles 'PING' messages with a 'PONG' reply
 */
class PingService extends Service {
    constructor(options) {
        super(SERVICE_NAME, options);

        this.addCommand(new Command('ping', {}, () => this.ping()));
    }

    ping() {
        // ** Handle PING requests
        return this.make_request('pong', 'ping');
    }
}

// ** Exports
module.exports = PingService;
module.exports.PingService = PingService;