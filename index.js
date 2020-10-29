var f = require("./Fixture.js");
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Cantidad de equipos? ', (answer) => {
  let n = parseInt(answer);
  let teams = f.createTeams(n);
  let rounds = f.balance(teams, f.rounds(teams));

  console.log(`Equipos: ${JSON.stringify(teams)}`);
  rounds.forEach((r, i) => {
    console.log(`Ronda ${i+1}: ${(r.map(m => m.r + " vs " + m.g).join(", "))}`)
  })

  rl.close();
});
