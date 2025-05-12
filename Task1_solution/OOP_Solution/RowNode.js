const Cell = require("./Cell");
const ValueGetter = require("./ValueGetter");

class RowNode {
  #rowData = {};

  #table = null;

  constructor(table, rowData) {
    this.#rowData = rowData;
    this.#table = table;
  }

  rowRenderer() {
    return this.#table.colDefs
      .map((colDef) => {
        const value = new ValueGetter(this, colDef).value();
        return new Cell(this, { value, colDef }).cellRenderer();
      })
      .join("");
  }

  get colDefs() {
    return this.#table.colDefs;
  }

  get gridOptions() {
    return this.#table.gridOptions;
  }

  get rowData() {
    return this.#rowData;
  }

  getValueByColId(colId) {
    return this.#rowData[colId];
  }
}

module.exports = RowNode;
