
var chai = require('chai')
var expect = chai.expect
var should = chai.should();
var assert = require('chai').assert;
chai.use(require('chai-things'));

var draw = require('../public/js/Draw.js');

describe("Draw.addParticipant", function() {

    var newDraw = new draw();

    it('should add a new participant to the list', function() {
        newDraw.addParticipant({name: "john"});
        newDraw.participants.should.include.something.that.deep.equals({ name: "john" });
    });

    it('should add a new participant and his/her spouse to the list', function() {
        newDraw.addParticipant({name: "bob", spouse: "kim"});
        newDraw.participants.should.include.something.that.deep.equals({ name: "bob", spouse: "kim" });
        newDraw.participants.should.include.something.that.deep.equals({ name: "kim", spouse: "bob" });
    });

    it('should throw an error if no argument', function() {
        expect(newDraw.addParticipant).to.throw(Error, "missing argument");
    });

});


describe("Draw.execute", function() {
    
    var newDraw = new draw();

    it('should stop and pass error in callback if the list of participants is empty', function(done) {
        assert.equal(newDraw.execute(function(err, result) {
            assert.isNotNull(err);
            done();
        }), 0);
    });

    it('should stop and pass error in calback if number of participant is an odd number', function(done) {

        newDraw.particpants = [
            {name: "john"},
            {name: "paul"},
            {name: "george"},
            {name: "ringo"}
        ];
        assert.equal(newDraw.execute(function(err, result) {
            assert.isNotNull(err);
            done();
        }), 0);
    });

    it('should stop and pass error in callback if the only two participants are in a couple together', function(done) {
        newDraw.participants = [
            {name: "barack", spouse: "michelle"},
            {name: "michelle", spouse: "barack"}
        ];

        assert.equal(newDraw.execute(function(err, result) {
            assert.isNotNull(err);
            done();
        }), 0);
    });

    it('should return 1 and pass an array matched participants in callback', function(done) {

        newDraw.participants = [
            {name: "barack", spouse: "michelle"},
            {name: "michelle", spouse: "barack"},
            {name: "john"},
            {name: "paul"},
            {name: "george"},
            {name: "ringo"}
        ];

        assert.equal(newDraw.execute(function(err, result) {
            assert.isNull(err);
            assert.isArray(result);
            result.should.all.have.property('1');
            result.should.all.have.property('2');
            done();
        }), 1);
    });
});

describe("Draw.process", function() {

    var newDraw = new draw();

    it("should return an array of randomly matched participants", function() {

        let participants = [
            {name: "barack", spouse: "michelle"},
            {name: "michelle", spouse: "barack"},
            {name: "john"},
            {name: "paul"},
            {name: "george"},
            {name: "ringo"}
        ];

        const result = newDraw.process(participants, []);

        assert.isArray(result);
        for (var i = 0; i < result.length; i++) {
            assert.notDeepEqual(result[i]["1"], result[i]["2"], "matched participants must not be equal");
        }
    });

    it("should throw an error if no argument", function() {

        expect(newDraw.process.bind(newDraw, null)).to.throw(Error, "missing argument");
    });

    it("should not match two participant that are a couple", function() {
        let participants = [
            
            {name: "david", spouse: "victoria"},
            {name: "victoria", spouse: "david"},
            {name: "romeo", spouse: "juliette"},
            {name: "juliette", spouse: "romeo"}
        ];

        var result = newDraw.process(participants, []);

        assert.isArray(result);

        for (var i = 0; i < result.length; i++) {

            const match1 = result[i]["1"];
            const match2 = result[i]["2"];

            match1.name.should.not.equal(match2.spouse, "matched participants are from the same couple");
            match2.name.should.not.equal(match1.spouse, "matched participants are from the same couple");
        }
    });

});