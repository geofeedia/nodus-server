'use strict';

// ** Dependencies
var uuid = require('node-uuid');

class LoggingContext {
    constructor(req){
        this.transaction = {};
        this.transaction.id = req.header('X-Transaction-ID', uuid.v4());
        this.request = {};
        this.request.id = req.header('X-Request-ID', uuid.v4());
        this.source = {};
        this.source.id = req.header('X-Source-ID', '-1');
    }
}

module.exports = LoggingContext;