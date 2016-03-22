'use strict';

// ** Dependencies
const http = require('http');
const io = require('socket.io');

// ** Libraries
const Interface = require('../lib/Interface');

// ** Platform
const errors = require('nodus-framework').errors;
const logger = require('nodus-framework').logging.createLogger();

class SocketInterface extends Interface {
    constructor(args, options, config) {
        super(args, options, config);

        this.host = config.host;
        this.port = config.port;

        this.server = http.createServer((req, res) => {
            throw errors('NOT_IMPLEMENTED');
        });

        this.socket = io(this.server);

        // ** Manage client connections
        this.socket.on('connection', socket => {
            logger.info('SOCKET:', socket);

            socket.on('close', () => {
                logger.info('SOCKET_CLOSED:', socket);
            })
        });
    }

    start() {
        // ** Start Web Socket Server
        logger.info('Listening for Web Socket connections.', {host: this.host, port: this.port});
        this.server.listen(this.host, this.port);

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
