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

        this.command(new Command('ping', {}, () => this.ping()));
    }

    ping() {
        // ** Handle PING requests
        return this.service_request('pong', 'ping');
    }
}

// ** Exports
module.exports = PingService;
module.exports.PingService = PingService;