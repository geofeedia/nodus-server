'use strict';

// ** Dependencies
const restify = require('restify');

// ** Libraries
const Interface = require('../../lib/Interface');

// ** Platform
const errors = require('nodus-framework').errors;
const logger = require('nodus-framework').logging.createLogger();

/**
 * Provides a RESTful HTTP interface
 */
class RestInterface extends Interface {
    constructor(args, options, config) {
        super(args, options, config);

        // ** Load configuration properties
        this.host = config.host;
        this.port = config.port;


    }
}

// ** Exports
module.exports = RestInterface;
module.exports.RestInterface = RestInterface;