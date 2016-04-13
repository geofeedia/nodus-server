'use strict';

// ** Constants
const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 3333;

// ** Dependencies
const http = require('http');

// ** Libraries
const WebSocketServer = require('ws').Server;
const Adapter = require('../lib/Adapter');

// ** Platform
const logger = require('nodus-framework').logging.createLogger();
const errors = require('nodus-framework').errors;

/**
 * Broadcasts all server events via a Web Socket
 */
class EventSocket extends Adapter {
    constructor(args, options, config) {
        super(args, options, config);

        const host = config.host || DEFAULT_HOST;
        const port = config.port || DEFAULT_PORT;

        // ** Create a new websocket
        const socket = new WebSocketServer({port: port, host: host});

        socket.on('open', function open() {
            console.log('connected');
            socket.send(Date.now().toString(), {mask: true});
        });
        socket.on('close', function close() {
            console.log('disconnected');
        });
        socket.on('message', function message(data, flags) {
            console.log('Roundtrip time: ' + (Date.now() - parseInt(data)) + 'ms', flags);

            setTimeout(function timeout() {
                socket.send(Date.now().toString(), {mask: true});
            }, 500);
        });

        this.socket = socket;
    }

    /**
     * Attach the adapter to the server.
     * @param server
     */
    attach(server) {

        // ** Log all events
        server.onAny((event, data) => {
            logger.warn('****** [EVENT]', event, data);

            // ** Requests
            // event:'request'
            // data: {
            //      id: <req-id>
            //      service:
            //      command:
            //      args:
            //      options:
            //      data:
            // }

            // ** Responses
            // event: 'response'
            // data: {
            //      id: <req-id>
            //      result:
            //      error:
            // }

            // ** Events
            // event: 'event'
            // data: { ... }

            
        });
    }
}

module.exports = EventSocket;
module.exports.EventSocket = EventSocket;