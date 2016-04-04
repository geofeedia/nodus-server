'use strict'

// ** Constants
const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 8080;

// ** Dependencies
const WebSocket = require('ws');

// ** Libraries
const Service = require('../../lib/Service');

// ** Platform
const logger = require('nodus-framework').logging.createLogger();

function logEvents() {
    var socket = new WebSocket('ws://localhost:3333/');

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

    return socket;
}

// ** Exports
module.exports = logEvents;