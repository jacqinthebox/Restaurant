module.exports = function() {
    var dotenv = require('dotenv');

    switch (process.env.NODE_ENV) {
        case 'development':
            dotenv._getKeysAndValuesFromEnvFilePath('.env.development');
            break;
        case 'production':
            dotenv._getKeysAndValuesFromEnvFilePath('.env.production');
            break;
        case 'example':
            dotenv._getKeysAndValuesFromEnvFilePath('.env.example');
            break;
        default:
            dotenv._getKeysAndValuesFromEnvFilePath('.env.example');
    }
    return dotenv._setEnvs();
};