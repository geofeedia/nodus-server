'use strict';

// ** Libraries
const Component = require('./Component');

// ** Platform
const errors = require('nodus-framework').errors;

/**
 * Represents a component that extends the core server functionality.
 * - Like an OS Driver.
 */
class Adapter extends Component {
    constructor(name, options) {
        super(name, options);

        throw errors('NOT_IMPLEMENTED');
    }

    /**
     * Attach this adapter to a server instance.
     * @param server
     */
    attach(server) {
        throw errors('NOT_IMPLEMENTED');
    }
}

// ** Exports
module.exports = Adapter;
module.exports.Adapter = Adapter;