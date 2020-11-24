var Fixture = (function () {

  function even(nteams) {
    let nrounds = nteams - 1;
    let matches_per_round = nteams / 2;

    let rounds = new Array(nrounds);
    for (let i = 0; i < rounds.length; i++) {
      rounds[i] = new Array(matches_per_round);
    }

    for (let i = 0, k = 0; i < nrounds; i++) {
      for (let j = 0; j < matches_per_round; j++) {
        rounds[i][j] = {home: -1, away: -1};
        rounds[i][j].home = k;

        k++;
        if (k == nrounds) {
          k = 0;
        }
      }
    }

    for (let i = 0; i < nrounds; i++) {
      if (i % 2 == 0) {
        rounds[i][0].away = nteams - 1;
      } else {
        rounds[i][0].away = rounds[i][0].home;
        rounds[i][0].home = nteams - 1;
      }
    }

    let last_team = nteams - 1;
    let last_odd_team = last_team - 1;

    for (let i = 0, k = last_odd_team; i < nrounds; i++) {
      for (let j = 1; j < matches_per_round; j++) {
        rounds[i][j].away = k;

        k--;

        if (k == -1) {
          k = last_odd_team;
        }
      }
    }

    return rounds;
  }

  function odd(nteams) {
    let nrounds = nteams;
    let matches_per_round = Math.floor(nteams / 2);

    let rounds = new Array(nrounds);
    for (let i = 0; i < rounds.length; i++) {
      rounds[i] = new Array(matches_per_round);
    }

    for (let i = 0, k = 0; i < nrounds; i++) {
      for (let j = -1; j < matches_per_round; j++) {
        if (j >= 0) {
          rounds[i][j] = {home: -1, away: -1};
          rounds[i][j].home = k;
        }

        k++;

        if (k == nrounds) {
          k = 0;
        }
      }
    }

    let last_team = nteams - 1;

    for (let i = 0, k = last_team; i < nrounds; i++) {
      for (let j = 0; j < matches_per_round; j++) {
        rounds[i][j].away = k;

        k--;

        if (k == -1) {
          k = last_team;
        }
      }
    }

    return rounds;
  }

  return {
    create: teams => {
      let rounds = null;
      if (teams.length % 2 == 0) {
        rounds = even(teams.length);
      } else {
        rounds = odd(teams.length);
      }
      return rounds.map(round => round.map(match => ({
        home: teams[match.home],
        away: teams[match.away]
      })));
    }
  };
})();

module.exports = Fixture;
