var Fixture = (function () {

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
    let ghost = -1;
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

  function balance(teams, rounds) {
    let balancedMatches = new Set(matches(teams).map(m => JSON.stringify(m)));
    return rounds.map(round => round.map(match => {
      if (balancedMatches.has(JSON.stringify(match))) return match;
      return {r: match.g, g: match.r};
    }));
  }

  return {
    create: teams => balance(teams, rounds(teams)),

    /* TESTING */
    matches: matches,
    rounds: rounds,
    balance: balance
  };
})();

module.exports = Fixture;
