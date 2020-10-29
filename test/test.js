var assert = require('assert');
var f = require("../Fixture.js");

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe("Fixture", function () {
  describe('create-teams', function () {
    it('create empty party', function() {
      assert.equal(JSON.stringify([]), JSON.stringify(f.createTeams(0)));
    });
    it('create party with 3 teams', function() {
      assert.equal(JSON.stringify(["A", "B", "C"]), JSON.stringify(f.createTeams(3)));
    });
  });

  describe("create-matches", function () {
    it('create matches with 3 teams', function () {
      let teams = f.createTeams(3);
      let matches = f.matches(teams);
      assert.equal(JSON.stringify(["AB","CA","BC"]), JSON.stringify(matches.map(m => m.r+m.g)));
      assert.ok(f.isBalanced(matches), "Matches are not balanced!");
    });
    it('create matches with 4 teams', function () {
      let teams = f.createTeams(4);
      let matches = f.matches(teams);
      assert.equal(JSON.stringify(["AB","CA","AD","BC","DB","CD"]), JSON.stringify(matches.map(m => m.r+m.g)));
      assert.ok(f.isBalanced(matches), "Matches are not balanced!");
    });
  });

  describe("rounds", function () {
    it ("create rounds with 4 teams", function () {
      let teams = f.createTeams(4);
      let actual = f.rounds(teams);
      let expected = [["AD", "BC"],
                      ["AC", "DB"],
                      ["AB", "CD"]];
      assert.equal(JSON.stringify(expected), JSON.stringify(actual.map(matches => matches.map(m => m.r+m.g))));
    });
    it ("create rounds with 5 teams", function () {
      let teams = f.createTeams(5);
      let actual = f.rounds(teams);
      let expected = [["AD", "BC"],
                      ["EC", "AB"],
                      ["DB", "EA"],
                      ["CA", "DE"],
                      ["BE", "CD"]];
      assert.equal(JSON.stringify(expected), JSON.stringify(actual.map(matches => matches.map(m => m.r+m.g))));
    });
  });


  describe("balanced rounds", function () {
    it ("create balanced rounds with 4 teams", function () {
      let teams = f.createTeams(4);
      let rounds = f.rounds(teams);
      let actual = f.balance(teams, rounds);
      assert.ok(f.isBalanced(actual), "Matches are not balanced!");
      assert.ok(f.isComplete(teams, actual), "Not all possible matches!");
    });
    it ("create balanced rounds with 5 teams", function () {
      let teams = f.createTeams(5);
      let rounds = f.rounds(teams);
      let actual = f.balance(teams, rounds);
      assert.ok(f.isBalanced(actual), "Matches are not balanced!");
      assert.ok(f.isComplete(teams, actual), "Not all possible matches!");
    });
  });

  describe("full check", function () {
    it("check all rounds from 2 to 25", function () {
      for (let i = 2; i < 26; i++) {
        let teams = f.createTeams(i);
        let rounds = f.rounds(teams);
        let actual = f.balance(teams, rounds);
        assert.ok(f.isBalanced(actual), "Matches are not balanced!");
        assert.ok(f.isComplete(teams, actual), "Not all possible matches!");
      }
    })
  })
});
