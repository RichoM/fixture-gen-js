var assert = require('assert');
var Fixture = require("../Fixture.js");

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
    teams.add(m.home);
    teams.add(m.away);
  });
  return teams;
}

function verify(teams, rounds) {
  // The number of rounds is correct
  let nrounds = teams.length % 2 == 0 ? teams.length - 1 : teams.length;
  if (rounds.length != nrounds) {
    throw new Error("Incorrect number of rounds!");
  }

  // Each round has the correct size
  let round_size = Math.floor(teams.length / 2);
  if (!rounds.every(round => round.length == round_size)) {
    throw new Error("Incorrect round size!");
  }

  let matches = rounds.flat();

  // Every team is matched with every other team
  for (let i = 0; i < teams.length - 1; i++) {
    let a = teams[i];
    for (let j = i + 1; j < teams.length; j++) {
      let b = teams[j];
      if (!matches.some(m => (m.home == a && m.away == b)
                          || (m.away == a && m.home == b))) {
        throw new Error("Not all possible matches!");
      }
    }
  }

  // Every team plays on either side the same number of times
  let half = (teams.length - 1) / 2;
  let expected = new Set([Math.floor(half), Math.ceil(half)]);
  if (!teams.every(team => expected.has(matches.filter(m => m.home == team).length))) {
    throw new Error("Matches are not balanced!");
  }

  return true;
}

describe("isComplete", function() {
  it("isComplete should detect missing match", function () {
    let teams = ["A", "B", "C"];
    let rounds = [[{home: "A", away: "B"}],
                  [{home: "C", away: "B"}],
                  [{home: "B", away: "A"}]];
    assert.throws(() => verify(teams, rounds), {message: "Not all possible matches!"});
  });

  it("isComplete should detect extra matches", function () {
    let teams = ["A", "B", "C"];
    let rounds = [[{home: "A", away: "B"},
                   {home: "B", away: "A"}],
                  [{home: "C", away: "B"},
                   {home: "B", away: "C"}],
                  [{home: "A", away: "C"},
                   {home: "C", away: "A"}]];
    assert.throws(() => verify(teams, rounds), {message: "Incorrect round size!"});
  });

  it("isComplete should detect extra rounds", function () {
    let teams = ["A", "B", "C"];
    let rounds = [[{home: "A", away: "B"}],
                  [{home: "B", away: "C"}],
                  [{home: "C", away: "A"}],
                  [{home: "B", away: "A"}]];
   assert.throws(() => verify(teams, rounds), {message: "Incorrect number of rounds!"});
  });

  it("isComplete should detect unbalanced fixture", function () {
    let teams = ["A", "B", "C"];
    let rounds = [[{home: "A", away: "B"}],
                  [{home: "C", away: "B"}],
                  [{home: "A", away: "C"}]];
    assert.throws(() => verify(teams, rounds), {message: "Matches are not balanced!"});
  });
})

describe('createTeams', function () {
  it('create empty party', function() {
    assert.equal(JSON.stringify([]), JSON.stringify(createTeams(0)));
  });
  it('create party with 3 teams', function() {
    assert.equal(JSON.stringify(["A", "B", "C"]), JSON.stringify(createTeams(3)));
  });
});

describe("Fixture", function () {
  describe("full check", function () {
    it("check all rounds from 2 to 25", function () {
      for (let i = 2; i < 26; i++) {
        let teams = createTeams(i);
        let rounds = Fixture.create(teams);
        verify(teams, rounds);
      }
    });
  });
});
