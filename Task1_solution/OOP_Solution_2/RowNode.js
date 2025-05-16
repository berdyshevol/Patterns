const DEFAULT_WIDTH = 10;
const DEFAULT_ALIGN = "left";

class RowNode {
  #rowData = {};

  #table = null;

  constructor(rowData, table) {
    this.#rowData = rowData;
    this.#table = table;
  }

  rowRenderer() {
    return this.#table.colDefs
      .map((colDef) => {
        const value = this.#valueGetter({ colDef });
        return this.#cellRenderer({ value, colDef });
      })
      .join("");
  }

  #valueGetter({ colDef }) {
    return typeof colDef.valueGetter === "function"
      ? colDef.valueGetter({
          colDef,
          rowData: this.#rowData,
          gridOptions: this.#table.gridOptions,
        })
      : this.#defaultValueGetter({ colDef });
  }

  #defaultValueGetter({ colDef }) {
    return this.#rowData[colDef.colId];
  }

  #cellRenderer({ value, colDef }) {
    const { width = DEFAULT_WIDTH, align = DEFAULT_ALIGN } = colDef;
    const strValue = this.#valueFormatter({
      value,
      colDef,
    });
    return align === "left" ? strValue.padEnd(width) : strValue.padStart(width);
  }

  #valueFormatter({ value, colDef }) {
    if (RowNode.#isEmptyValue(value)) return "";

    const { valueFormatter } = colDef;
    if (typeof valueFormatter === "function") {
      return colDef.valueFormatter({
        value,
        colDef,
        rowData: this.#rowData,
        gridOptions: this.#table.gridOptions,
      });
    }
    return RowNode.#defaultValueFormatter({ value, colDef });
  }

  static #defaultValueFormatter = ({ value, colDef }) => {
    const { type = "string" } = colDef;
    const serializerMap = {
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
    const serializer = serializerMap[type] || serializerMap.default;
    return serializer(value);
  };

  static #isEmptyValue = (value) =>
    value == null || value === undefined || Number.isNaN(value);
}

module.exports = RowNode;
