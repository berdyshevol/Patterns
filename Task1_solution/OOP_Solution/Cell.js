const DEFAULT_WIDTH = 10;
const DEFAULT_ALIGN = "left";

class Cell {
  #rowNode = null;

  #value;

  #colDef = {};

  constructor(rowNode, { value, colDef }) {
    this.#rowNode = rowNode;
    this.#value = value;
    this.#colDef = colDef;
  }

  cellRenderer() {
    const { width = DEFAULT_WIDTH, align = DEFAULT_ALIGN } = this.#colDef;
    const strValue = this.#valueFormatter();
    return align === "left" ? strValue.padEnd(width) : strValue.padStart(width);
  }

  #valueFormatter() {
    if (this.#isEmptyValue()) return "";

    const { valueFormatter } = this.#colDef;
    if (typeof valueFormatter === "function") {
      return this.#colDef.valueFormatter({
        value,
        colDef,
        rowData: this.#rowNode.rowData,
        gridOptions: this.#rowNode.gridOptions,
      });
    }
    return this.#defaultValueFormatter();
  }

  #defaultValueFormatter = () => {
    const { type = "string" } = this.#colDef;
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
    return serializer(this.#value);
  };

  #isEmptyValue = () =>
    this.#value == null ||
    this.#value === undefined ||
    Number.isNaN(this.#value);
}

module.exports = Cell;
