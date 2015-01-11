//mongodb
var foodstuff = require('./controller.food');

module.exports = function (app) {
    app.route('/food').post(foodstuff.create);
    app.route('/food').get(foodstuff.list);
    app.route('/food/:id').get(foodstuff.findOne);
    app.route('/foodname/:name').get(foodstuff.findByName);
};