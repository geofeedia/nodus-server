'use strict';

// ** Libraries
const Interface = require('../lib/Interface');

// ** Platform
const errors = require('nodus-framework').errors;
const logger = require('nodus-framework').logging.createLogger();

class SocketInterface extends Interface {
    constructor(args, options) {
        super(args, options);

        throw errors('NOT_IMPLEMENTED');
    }
    start() {
        // ** Start Web Socket Server

        // ** Receive a REQUEST from the WebSocket server
        // ** Send a RESPONSE to the WebSocket server

        // ** Broadcast events via web socket subscriptions
        
        super.start();
    }
    stop() {
        // ** Stop Web Socket Server
        super.stop();
    }
}

// ** Exports
module.exports = SocketInterface;
module.exports.SocketInterface = SocketInterface;
