const fs = require('fs');
const c = fs.readFileSync('/Users/mbaid/telephone-draw/game/simple-words.ts', 'utf8');
const m = c.match(/"([^"]+)"/g);
const w = m.map(x => x.slice(1, -1));
console.log('Total:', w.length);
const s = new Set(w);
console.log('Unique:', s.size);
const d = w.filter((x, i) => w.indexOf(x) !== i);
if (d.length > 0) {
  console.log('Dupes:', d.length);
  console.log([...new Set(d)].join(', '));
} else {
  console.log('No dupes');
}
