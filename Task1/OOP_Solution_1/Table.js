const RowNode = require("./RowNode");

const DEFAULT_LEFT_PADDING = 0;

const normalizerMap = {
  string: (value) => value,
  number: (value) => Number(value),
};

class Table {
  #gridOptions = {};

  #rowsDataAfterFilteringAndSorting = [];

  constructor(gridOptions) {
    this.#gridOptions = gridOptions;
  }

  render() {
    // filtering could be added here
    let rowsDataAfterFiltering = this.#gridOptions.rowsData;
    const rowsDataAfterFilteringAndSorting = this.#sortRowsData(
      rowsDataAfterFiltering
    );
    this.#rowsDataAfterFilteringAndSorting = rowsDataAfterFilteringAndSorting;
    return this.#gridRenderer();
  }

  get gridOptions() {
    return this.#gridOptions;
  }

  get colDefs() {
    return this.#gridOptions.colDefs;
  }

  #sortRowsData(rowsData) {
    const ComporatorMap = {
      asc: (a, b) => a[sortKey] - b[sortKey],
      desc: (a, b) => b[sortKey] - a[sortKey],
    };
    if (!this.#gridOptions?.sort) return rowsData;
    const [sortKey, sortOrder] = Object.entries(this.#gridOptions.sort)[0];
    const comparator = ComporatorMap[sortOrder] || ComporatorMap.asc;
    return [...rowsData].sort(comparator);
  }

  #gridRenderer() {
    return this.#rowsDataAfterFilteringAndSorting
      .map((rowData) =>
        Table.#addPaddings(
          new RowNode(this, rowData).rowRenderer(),
          this.#gridOptions.leftPadding
        )
      )
      .join("\n");
  }

  static #addPaddings(str, leftPadding = DEFAULT_LEFT_PADDING) {
    return `${" ".repeat(leftPadding)}${str}`;
  }
}

module.exports = Table;
