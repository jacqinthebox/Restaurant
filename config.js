module.exports = function() {
    var dotenv = require('dotenv');

    switch (process.env.NODE_ENV) {
        case 'development':
            dotenv._getKeysAndValuesFromEnvFilePath('.env.development');
            break;
        case 'production':
            dotenv._getKeysAndValuesFromEnvFilePath('.env.production');
            break;
        default:
            dotenv._getKeysAndValuesFromEnvFilePath('.env.development');
    }
    return dotenv._setEnvs();
};