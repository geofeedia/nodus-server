const jwt = require('./jwt');
const EncryptionAdapter = require('../lib/EncryptionAdapter');

module.exports = {
    jwt: jwt,
    default: EncryptionAdapter
};
