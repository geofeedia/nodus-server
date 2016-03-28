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

    attach(server) {
        logger.info('Attaching to server event stream...');

        // ** Log all events
        server.onAny((event, value) => {
            logger.info('[EVENT]', value, {event: event});
        });
    }
}

module.exports = EventSocket;
module.exports.EventSocket = EventSocket;