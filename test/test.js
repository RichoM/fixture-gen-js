var assert = require('assert');
var f = require("../Fixture.js");

function createTeams(n) {
  const letters = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
  let teams = [];
  for (let i = 0; i < n; i++) {
    teams.push(letters[i]);
  }
  return teams;
}

function distinctTeams(matches) {
  matches = matches.flat();
  let teams = new Set();
  matches.forEach(m => {
    teams.add(m.r);
    teams.add(m.g);
  });
  return teams;
}

function isBalanced(matches) {
  matches = matches.flat();
  let teams = distinctTeams(matches);
  let half = (teams.size - 1) / 2;
  let expected = new Set([Math.floor(half), Math.ceil(half)]);
  return Array.from(teams).every(team => expected.has(matches.filter(m => m.r == team).length));
}

function isComplete(teams, rounds) {
  let expected = f.matches(teams);
  let actual = rounds.flat();
  if (expected.length != actual.length) return false;

  let expected_set = new Set(expected.map(m => JSON.stringify(m)));
  let actual_set = new Set(actual.map(m => JSON.stringify(m)));
  if (actual.length != actual_set.size) return false; // No duplicates!

  if (!expected.every(m => actual_set.has(JSON.stringify(m)))) return false;
  if (!actual.every(m => expected_set.has(JSON.stringify(m)))) return false;

  return true;
}

describe("Fixture", function () {
  describe('create-teams', function () {
    it('create empty party', function() {
      assert.equal(JSON.stringify([]), JSON.stringify(createTeams(0)));
    });
    it('create party with 3 teams', function() {
      assert.equal(JSON.stringify(["A", "B", "C"]), JSON.stringify(createTeams(3)));
    });
  });

  describe("create-matches", function () {
    it('create matches with 3 teams', function () {
      let teams = createTeams(3);
      let matches = f.matches(teams);
      assert.equal(JSON.stringify(["AB","CA","BC"]), JSON.stringify(matches.map(m => m.r+m.g)));
      assert.ok(isBalanced(matches), "Matches are not balanced!");
    });
    it('create matches with 4 teams', function () {
      let teams = createTeams(4);
      let matches = f.matches(teams);
      assert.equal(JSON.stringify(["AB","CA","AD","BC","DB","CD"]), JSON.stringify(matches.map(m => m.r+m.g)));
      assert.ok(isBalanced(matches), "Matches are not balanced!");
    });
  });

  describe("rounds", function () {
    it ("create rounds with 4 teams", function () {
      let teams = createTeams(4);
      let actual = f.rounds(teams);
      let expected = [["AD", "BC"],
                      ["AC", "DB"],
                      ["AB", "CD"]];
      assert.equal(JSON.stringify(expected), JSON.stringify(actual.map(matches => matches.map(m => m.r+m.g))));
    });
    it ("create rounds with 5 teams", function () {
      let teams = createTeams(5);
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
      let teams = createTeams(4);
      let rounds = f.rounds(teams);
      let actual = f.balance(teams, rounds);
      assert.ok(isBalanced(actual), "Matches are not balanced!");
      assert.ok(isComplete(teams, actual), "Not all possible matches!");
    });
    it ("create balanced rounds with 5 teams", function () {
      let teams = createTeams(5);
      let rounds = f.rounds(teams);
      let actual = f.balance(teams, rounds);
      assert.ok(isBalanced(actual), "Matches are not balanced!");
      assert.ok(isComplete(teams, actual), "Not all possible matches!");
    });
  });

  describe("full check", function () {
    it("check all rounds from 2 to 25", function () {
      for (let i = 2; i < 26; i++) {
        let teams = createTeams(i);
        let rounds = f.rounds(teams);
        let actual = f.balance(teams, rounds);
        assert.ok(isBalanced(actual), "Matches are not balanced!");
        assert.ok(isComplete(teams, actual), "Not all possible matches!");
      }
    })
  })
});
