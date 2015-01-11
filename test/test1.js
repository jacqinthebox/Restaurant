var superagent = require('superagent');
var chai = require('chai');
var expect = chai.expect;

describe("Food JSON api", function() {  

  it("should return a json array", function(done) {
    superagent.get('http://localhost:3001/food')
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.type).to.equal("application/json");
        done();
      });
  });


  it("should post a new piece of food", function(done) {
    superagent.post('http://localhost:3001/food/')
      .send({
        name: "awesome food in test db from env", description: "awesome food description", price: "16,00"
      })
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body._id).to.not.be.eql(null);
        id = res.body._id;
        done();
      });
  });

});


