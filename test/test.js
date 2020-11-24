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
    teams.add(m.r);
    teams.add(m.g);
  });
  return teams;
}

function isBalanced(teams, rounds) {
  let matches = rounds.flat();
  let half = (teams.length - 1) / 2;
  let expected = new Set([Math.floor(half), Math.ceil(half)]);
  return teams.every(team => expected.has(matches.filter(m => m.r == team).length));
}

function isComplete(teams, rounds) {
  // The number of rounds is correct
  let nrounds = teams.length % 2 == 0 ? teams.length - 1 : teams.length;
  if (rounds.length != nrounds) return false;

  // Each round has the correct size
  let round_size = Math.floor(teams.length / 2);
  if (!rounds.every(round => round.length == round_size)) return false;

  // Every team is matched with every other team
  let matches = rounds.flat();
  for (let i = 0; i < teams.length - 1; i++) {
    let a = teams[i];
    for (let j = i + 1; j < teams.length; j++) {
      let b = teams[j];
      if (!matches.some(m => (m.r == a && m.g == b)
                          || (m.g == a && m.r == b))) {
        return false;
      }
    }
  }

  return true;
}

describe("isComplete", function() {
  it("isComplete should detect missing match", function () {
    let teams = ["A", "B", "C"];
    let rounds = [[{r: "A", g: "B"}],
                  [{r: "C", g: "B"}],
                  [{r: "B", g: "A"}]];
    assert.ok(!isComplete(teams, rounds));
  });

  it("isComplete should detect extra matches", function () {
    let teams = ["A", "B", "C"];
    let rounds = [[{r: "A", g: "B"},
                   {r: "B", g: "A"}],
                  [{r: "C", g: "B"},
                   {r: "B", g: "C"}],
                  [{r: "A", g: "C"},
                   {r: "C", g: "A"}]];
    assert.ok(!isComplete(teams, rounds));
  });

  it("isComplete should detect extra rounds", function () {
    let teams = ["A", "B", "C"];
    let rounds = [[{r: "A", g: "B"}],
                  [{r: "B", g: "C"}],
                  [{r: "C", g: "A"}],
                  [{r: "B", g: "A"}]];
    assert.ok(!isComplete(teams, rounds));
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
        let actual = Fixture.create(teams);
        assert.ok(isBalanced(teams, actual), "Matches are not balanced!");
        assert.ok(isComplete(teams, actual), "Not all possible matches!");
      }
    })
  })
});
