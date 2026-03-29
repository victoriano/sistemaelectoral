import { electionData } from "./src/data/all-elections.ts";
const circs = electionData["2023"];
const medium = circs.filter(c => c.seats >= 5 && c.seats <= 12).sort((a,b) => b.seats - a.seats);
for (const c of medium) {
  const top = Object.entries(c.votes).sort((a,b) => b[1] - a[1]).slice(0, 8);
  console.log(`${c.name} (${c.seats} escaños): ${top.map(([p,v]) => `${p}:${(v/1000).toFixed(0)}k`).join(', ')}`);
}
