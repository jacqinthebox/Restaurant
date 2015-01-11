var dotenv = require('dotenv');
var Food = require('./app/model.food.js');
var User = require('./app/model.user.js');

module.exports = function() {
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


    //seed, thanks Joe Eames

    Food.find({}).exec(function (err, collection) {
            if (collection.length === 0) {
            Food.create({"name": "Papadums", "description": "Thin white bread", "price": '3,00'});
            Food.create({"name": 'Naan', "description": "Delicious traditional bread", "price": '3,00'});
            Food.create({"name": 'Dal', "description": 'Veggie lentils recipe', "price": '6,00'});
            Food.create({"name": 'Chicken Tikka Massala', "description": 'Tradition chicken in Massala sauce', "price": '16,00'});
        }
    })

    User.find({}).exec(function (err, collection) {
        if (collection.length === 0) {


            User.register(new User({
                username: "admin@example.com",
                firstname: "admin"
            }), "admin");


          //  User.register({"firstname": "Admin", "username": "admin@example.com", "password": 'admin'});

        }
    })

    return dotenv._setEnvs();
};