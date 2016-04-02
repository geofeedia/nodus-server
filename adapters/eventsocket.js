'use strict';

// ** Dependencies
const http = require('http');
const io = require('socket.io');

// ** Libraries
const Adapter = require('../lib/Adapter');

// ** Platform
const logger = require('nodus-framework').logging.createLogger();
const errors = require('nodus-framework').errors;

/**
 * Broadcasts all server events via a Web Socket
 */
class EventSocket extends Adapter {
    constructor(name, options, config) {
        super(name, options);

        this.host = config.host;
        this.port = config.port;
    }

    load(server) {
        // ** Log all events
        server.onAny((event, data) => {
            logger.info('[EVENT]', event, data);
        });
    }
}

module.exports = EventSocket;
module.exports.EventSocket = EventSocket;