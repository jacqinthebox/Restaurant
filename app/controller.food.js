var Food = require('./model.food.js');

exports.create = function (req, res) {
    var food = new Food(req.body);
    console.log(food);
    food.save(function (err) {
        if (err) {
            return res.send({
                message: err
            });
        } else {
            res.send({
                success: true,
                food: food
            });
        }
    });
};

exports.list = function (req, res) {
    Food.find(function (err, data) {
        if (err) {
            res.send(err);
        }
        res.json({
            success: true,
            food: data
        });
    });
};


exports.findOne = function (req, res) {
    Food.findOne({
        _id: req.params.id
    }, function (error, response) {
        if (error) {
            res.send(error);
        } else {
            res.send({
                success: true,
                food: response
            });
        }
    });
};

exports.findByName = function (req, res) {
    Food.findOne({
        name: req.params.name
    }, function (error, response) {
        if (error || !response) {
            res.status(404).send({
                status: 401,
                message: 'not found'
            });
        } else {
            res.send({
                success: true,
                food: response
            });
        }
    });
}