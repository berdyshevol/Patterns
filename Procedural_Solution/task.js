const { parseCSV, getRowsData, tableRenderer } = require("./helpers");

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

const COLUMN_TYPES = {
  city: "string",
  population: "number",
  area: "number",
  density: "number",
  country: "string",
};

const COLUMN_DEFINITIONS = [
  { colId: "city", type: "string", width: 18 },
  { colId: "population", type: "number", width: 10, align: "right" },
  { colId: "area", type: "number", width: 8, align: "right" },
  { colId: "density", type: "number", width: 8, align: "right" },
  { colId: "country", type: "string", width: 18, align: "right" },
  {
    colId: undefined, // JUST to show that colId is not required
    type: "number",
    width: 6,
    align: "right",
    valueGetter: ({ rowData, context }) =>
      Math.round((rowData.density * 100) / context.maxDensity),
  },
];

const rows = parseCSV(data);
const rowsData = getRowsData(rows, COLUMN_TYPES);
const maxDensity = Math.max(...rowsData.map((row) => row.density));
const printStr = tableRenderer({
  rowsData,
  colDefs: COLUMN_DEFINITIONS,
  context: { maxDensity },
  sort: { density: "desc" },
});
console.log(printStr);
