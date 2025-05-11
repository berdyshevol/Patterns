const CSV = require("./CSV.js");

const MormalizerMap = {
  string: (value) => value,
  number: (value) => Number(value),
  date: (value) => new Date(value),
};

class Transformer {
  #csv = CSV;

  #rawRows = [];

  constructor(str) {
    this.#rawRows = new this.#csv(str).parse();
  }

  rowsData(schema) {
    const [headers, ...rows] = this.#rawRows;
    const rowData = [];
    for (const row of rows) {
      const hash = {};
      for (let index = 0; index < headers.length; index++) {
        const header = headers[index];
        const cell = row[index];
        if (cell === "") {
          hash[header] = null;
          continue;
        }
        const type = schema[header];
        const normalizer = MormalizerMap[type];
        if (!normalizer) {
          throw new Error(`Unknown type: ${type}`);
        }
        const value = normalizer(cell);
        hash[header] = value;
      }
      rowData.push(hash);
    }
    return rowData;
  }
}

module.exports = Transformer;
