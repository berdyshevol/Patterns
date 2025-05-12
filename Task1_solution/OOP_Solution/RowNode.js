const DEFAULT_WIDTH = 10;
const DEFAULT_ALIGN = "left";

class RowNode {
  #rowData = {};
  #gridOptions = {};

  constructor(rowData, gridOptions) {
    this.#rowData = rowData;
    this.#gridOptions = gridOptions;
  }

  rowRenderer() {
    return this.#gridOptions.colDefs
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
          ...this.#gridOptions,
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
        ...this.#gridOptions,
      });
    }
    return RowNode.#defaultValueFormatter({ value, colDef });
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

module.exports = RowNode;
