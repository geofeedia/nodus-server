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

        const self = this;

        // ** /ping/send?delay=<optional>
        this.addCommand(new Command('send', {}, function (delay) {
            // ** Send a 'ping' request to the 'pong' service.
            return self.request('pong', 'ping', {}, {delay: delay});
        }));
    }
}

// ** Exports
module.exports = PingService;
module.exports.PingService = PingService;