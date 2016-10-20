'use strict'

const EncryptionAdapter = require('../lib/EncryptionAdapter');
const jwt = require('jsonwebtoken');
const errors = require('nodus-framework').errors;

class JWT extends EncryptionAdapter{
    constructor(configs){
        super(configs);
        this.privateKey = this.configs.privateKey;
        this.field = 'Jwt';
    }
    _isString(value){
        return typeof value === 'string' || value instanceof String;
    }
    decode(data){
        const value = data[this.field];
        if (!this._isString(value)){
            throw errors(400, 'invalid jwt format');
        }
        var decoded;
        try {
            decoded = jwt.verify(value, this.privateKey);
        }
        catch(err){
            throw errors(401, 'invalid jwt', err);
        }
        return decoded;
    }
    encode(response){
        var encoded = {};
        encoded[this.field] = jwt.sign(response, this.privateKey);
        return encoded;
    }
}

module.exports = JWT;