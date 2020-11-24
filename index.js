var f = require("./Fixture.js");
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function createTeams(n) {
  const letters = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
  let teams = [];
  for (let i = 0; i < n; i++) {
    teams.push(letters[i]);
  }
  return teams;
}

rl.question('Cantidad de equipos? ', (answer) => {
  let n = parseInt(answer);
  let teams = createTeams(n);
  let rounds = f.create(teams);

  console.log(`Equipos: ${JSON.stringify(teams)}`);
  rounds.forEach((r, i) => {
    console.log(`Ronda ${i+1}: ${(r.map(m => m.home + " vs " + m.away).join(", "))}`)
  })

  rl.close();
});
