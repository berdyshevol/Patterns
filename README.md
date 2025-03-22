### Task: refactor task.js using OOP, Functional, and Procedural programming approaches.

#### Repository Links:

- [Original Task](https://github.com/berdyshevol/Patterns/blob/master/Task_0/task.js)
- [OOP Solution](https://github.com/berdyshevol/Patterns/blob/master/OOP_Solution/task.js)
- [Procedural Solution](https://github.com/berdyshevol/Patterns/blob/master/Procedural_Solution/task.js)
- [Functional Solution](https://github.com/berdyshevol/Patterns/blob/master/Functional_Solution/task.js)

---

### Installation

To install dependencies:

```bash
npm install
```

### Running Tests

To execute tests:

```bash
npm test
```

### Running Solutions

Execute the Original Task:

```bash
node ./task.js
```

Execute the OOP Solution:

```bash
node ./OOP_Solution/task.js
```

Execute the Procedural Solution:

```bash
node ./Procedural_Solution/task.js
```

Execute the Functional Solution:

```bash
node ./Functional_Solution/task.js
```

---

### Task Description

Refactor solution into compliance with the principles of:

1. Object-Oriented Programming (OOP)

2. Functional Programming (FP)

3. Procedural Programming

```javascript
const data = `city,population,area,density,country
  Shanghai,24256800,6340,3826,China
  Delhi,16787941,1484,11313,India
  Lagos,16060303,1171,13712,Nigeria
  Istanbul,14160467,5461,2593,Turkey
  Tokyo,13513734,2191,6168,Japan
  Sao Paulo,12038175,1521,7914,Brazil
  Mexico City,8874724,1486,5974,Mexico
  London,8673713,1572,5431,United Kingdom
  New York City,8537673,784,10892,United States
  Bangkok,8280925,1569,5279,Thailand`;

if (data) {
  const lines = data.split("\n");
  lines.pop();
  const table = [];
  let first = true;
  let max = 0;

  for (const line of lines) {
    if (first) {
      first = false;
    } else {
      const cells = line.split(",");
      const d = parseInt(cells[3]);
      if (d > max) max = d;
      table.push([cells[0], cells[1], cells[2], cells[3], cells[4]]);
    }
  }

  for (const row of table) {
    const a = Math.round((row[3] * 100) / max);
    row.push(a.toString());
  }

  table.sort((r1, r2) => r2[5] - r1[5]);

  for (const row of table) {
    let s = row[0].padEnd(18);
    s += row[1].padStart(10);
    s += row[2].padStart(8);
    s += row[3].padStart(8);
    s += row[4].padStart(18);
    s += row[5].padStart(6);
    console.log(s);
  }
}
```
