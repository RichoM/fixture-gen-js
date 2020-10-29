
function createTeams(n) {
  const letters = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
  let teams = [];
  for (let i = 0; i < n; i++) {
    teams.push(letters[i]);
  }
  return teams;
}

function matches(teams) {
  let matches = [];
  for (let i = 0; i < teams.length - 1; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      if ((j - i) % 2 == 0) {
        matches.push({r: teams[j], g: teams[i]});
      } else {
        matches.push({r: teams[i], g: teams[j]});
      }
    }
  }
  return matches;
}

/*
NOTE(Richo): Cyclic algorithm taken from https://www.devenezia.com/downloads/round-robin/
*/
function rounds(t) {
  let ghost = "_";
  let teams = t.slice();
  if (teams.length % 2 == 1) {
    teams.unshift(ghost);
  }

  let rounds = [];
  let fixed = teams[0];
  let rest = teams.slice(1);
  for (let i = 0; i < teams.length - 1; i++) {
    let round = [];
    rest.unshift(rest.pop()); // Cycle
    if (fixed != ghost) {
      round.push({r: fixed, g: rest[0]});
    }
    for (let j = 0; j < (rest.length - 1) / 2; j++) {
      let r = j + 1;
      let g = rest.length - (j + 1);
      let match = {r: rest[r], g: rest[g]};
      round.push(match);
    }
    rounds.push(round);
  }
  return rounds;
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

function balance(teams, rounds) {
  let balancedMatches = new Set(matches(teams).map(m => JSON.stringify(m)));
  return rounds.map(round => round.map(match => {
    if (balancedMatches.has(JSON.stringify(match))) return match;
    return {r: match.g, g: match.r};
  }));
}

function isComplete(teams, rounds) {
  let expected = matches(teams);
  let actual = rounds.flat();
  if (expected.length != actual.length) return false;

  let expected_set = new Set(expected.map(m => JSON.stringify(m)));
  let actual_set = new Set(actual.map(m => JSON.stringify(m)));
  if (actual.length != actual_set.size) return false; // No duplicates!

  if (!expected.every(m => actual_set.has(JSON.stringify(m)))) return false;
  if (!actual.every(m => expected_set.has(JSON.stringify(m)))) return false;

  return true;
}

module.exports = {
  createTeams: createTeams,
  matches: matches,
  rounds: rounds,
  isBalanced: isBalanced,
  balance: balance,
  isComplete: isComplete
};
