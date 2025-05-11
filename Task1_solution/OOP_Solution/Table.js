const DEFAULT_WIDTH = 10;
const DEFAULT_ALIGN = "left";
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

  #sortRowsData(rowsData) {
    const ComporatorMap = {
      asc: (a, b) => a[sortKey] - b[sortKey],
      desc: (a, b) => b[sortKey] - a[sortKey],
    };
    const [sortKey, sortOrder] = Object.entries(this.#gridOptions.sort)[0];
    const comparator = ComporatorMap[sortOrder] || ComporatorMap.asc;
    return rowsData.sort(comparator);
  }

  #gridRenderer() {
    return this.#rowsDataAfterFilteringAndSorting
      .map((rowData) =>
        Table.#addPaddings(
          this.#rowRenderer({
            rowData,
          }),
          this.#gridOptions.leftPadding
        )
      )
      .join("\n");
  }

  static #addPaddings(str, leftPadding = DEFAULT_LEFT_PADDING) {
    return `${" ".repeat(leftPadding)}${str}`;
  }

  #rowRenderer({ rowData }) {
    return this.#gridOptions.colDefs
      .map((colDef) => {
        const value = this.#valueGetter({ colDef, rowData });
        return this.#cellRenderer({ value, colDef, rowData });
      })
      .join("");
  }

  #valueGetter({ colDef, rowData }) {
    return typeof colDef.valueGetter === "function"
      ? colDef.valueGetter({ colDef, rowData, ...this.#gridOptions })
      : Table.#defaultValueGetter({ colDef, rowData });
  }

  static #defaultValueGetter({ colDef, rowData }) {
    return rowData[colDef.colId];
  }

  #cellRenderer({ value, colDef, rowData }) {
    // Here we can add a cellRender function in colDef to format the value
    // This is why #cellRenderer is a method and not a static method
    const { width = DEFAULT_WIDTH, align = DEFAULT_ALIGN } = colDef;
    const strValue = this.#valueFormatter({ value, colDef, rowData });
    return align === "left" ? strValue.padEnd(width) : strValue.padStart(width);
  }

  #valueFormatter({ value, colDef, rowData }) {
    if (Table.#isEmptyValue(value)) return "";

    const { valueFormatter } = colDef;
    if (typeof valueFormatter === "function") {
      return colDef.valueFormatter({
        value,
        colDef,
        rowData,
        ...this.#gridOptions,
      });
    }
    return Table.#defaultValueFormatter({ value, colDef });
  }

  static #defaultValueFormatter = ({ value, colDef }) => {
    const { type = "string" } = colDef;
    const serializerMan = {
      string: (value) => value.toString(),
      number: (value) => value.toString(),
      default: (value) => value.toString(),
      date: (value) =>
        value.totoLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
    };
    const serializer = serializerMan[type] || serializerMan.default;
    return serializer(value);
  };

  static #isEmptyValue = (value) =>
    value == null || value === undefined || Number.isNaN(value);
}

module.exports = Table;
