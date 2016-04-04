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

        // ** Add a PING command that issues a 'PONG' request to the server
        const self = this;
        this.addCommand(new Command('pong', {}, function (delay) {
            // ** Send a 'ping' request (to the 'pong' service.)
            return self.request({
                // service: 'pong',
                command: 'ping',
                options: {delay: delay}
            });
        }));
    }
}

// ** Exports
module.exports = PingService;
module.exports.PingService = PingService;