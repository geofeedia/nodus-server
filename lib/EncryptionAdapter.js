'use strict'

class EncryptionAdapter{
    constructor(configs){
        this.configs = configs || {};
    }
    decodeQuerystring(args){
        return args;
    }
    decodeBody(body){
        return body;
    }
    encode(response){
        return response;
    }
}


module.exports = EncryptionAdapter;