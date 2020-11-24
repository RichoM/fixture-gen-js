var Fixture = (function () {

  function matches(teams) {
    let matches = [];
    for (let i = 0; i < teams.length - 1; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        if ((j - i) % 2 == 0) {
          matches.push({home: teams[j], away: teams[i]});
        } else {
          matches.push({home: teams[i], away: teams[j]});
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
        round.push({home: fixed, away: rest[0]});
      }
      for (let j = 0; j < (rest.length - 1) / 2; j++) {
        let r = j + 1;
        let g = rest.length - (j + 1);
        let match = {home: rest[r], away: rest[g]};
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
      return {home: match.away, away: match.home};
    }));
  }

  return {
    create: teams => {
      let indices = teams.map((_, i) => i);
      let balanced_rounds = balance(indices, rounds(indices));
      return balanced_rounds.map(round => round.map(match => ({
        home: teams[match.home],
        away: teams[match.away]
      })));
    }
  };
})();

module.exports = Fixture;
