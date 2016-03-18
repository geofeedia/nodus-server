'use strict';

// ** Dependencies
const Component = require('./Component');

/**
 * A Program is a container representing a running application
 * it's environment, external dependencies, and provides facilities for:
 * - logging
 * - tracing
 * - events
 * - jobs
 * - benchmarks
 * - service calls
 * - resources
 */
class Program extends Component {
    constructor(args, options) {
        super(args, options);
    }
}

// ** Exports
module.exports = Program;
module.exports.Program = Program;