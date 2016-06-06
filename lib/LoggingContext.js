'use strict';

// ** Dependencies
var uuid = require('node-uuid');
var ExecutionContext = require('nodus-framework').executionContext;

class LoggingContext extends ExecutionContext{
    constructor(req){
        if (!req){
            super();
            return;
        }
        super(req.header('X-Transaction-ID'), req.header('X-Request-ID'), req.header('X-Source-ID', '-1'));
    }
}

module.exports = LoggingContext;