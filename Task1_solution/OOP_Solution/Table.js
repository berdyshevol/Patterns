const DEFAULT_WIDTH = 10;
const DEFAULT_ALIGN = "left";
const DEFAULT_LEFT_PADDING = 0;

const normalizerMap = {
  string: (value) => value,
  number: (value) => Number(value),
};

class Table {
  constructor({
    rowsData,
    colDefs,
    context,
    sort,
    leftPadding = DEFAULT_LEFT_PADDING,
  }) {
    this.rowsData = rowsData;
    this.colDefs = colDefs;
    this.context = context;
    this.sort = sort;
    this.leftPadding = leftPadding;

    this.render = this.render.bind(this);
    this.sortRowsData = this.sortRowsData.bind(this);
    this.gridRenderer = this.gridRenderer.bind(this);
    this.addPaddings = this.addPaddings.bind(this);
    this.rowRenderer = this.rowRenderer.bind(this);
    this.valueGetter = this.valueGetter.bind(this);
    this.defaultValueGetter = this.defaultValueGetter.bind(this);
    this.cellRenderer = this.cellRenderer.bind(this);
    this.valueFormatter = this.valueFormatter.bind(this);
  }

  render() {
    const rowsData = this.sortRowsData();
    return this.gridRenderer({
      rowsData,
      colDefs: this.colDefs,
      context: this.context,
      leftPadding: this.leftPadding,
    });
  }

  sortRowsData() {
    const [sortKey, sortOrder] = Object.entries(this.sort)[0];
    return this.rowsData.sort((a, b) =>
      sortOrder === "asc" ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
    );
  }

  addPaddings(str, leftPadding = DEFAULT_LEFT_PADDING) {
    return `${" ".repeat(leftPadding)}${str}`;
  }

  gridRenderer({
    rowsData,
    colDefs,
    context,
    leftPadding = DEFAULT_LEFT_PADDING,
  }) {
    return rowsData
      .map((rowData) =>
        this.addPaddings(
          this.rowRenderer({
            rowData,
            colDefs,
            context,
          }),
          leftPadding
        )
      )
      .join("\n");
  }

  rowRenderer({ rowData, colDefs, context }) {
    return colDefs
      .map((colDef) => {
        const data = this.valueGetter({ colDef, rowData, context });
        return this.cellRenderer({ data, ...colDef });
      })
      .join("");
  }

  cellRenderer({ data, width = DEFAULT_WIDTH, align = DEFAULT_ALIGN }) {
    const strValue = this.valueFormatter({ data });
    return align === "left" ? strValue.padEnd(width) : strValue.padStart(width);
  }

  valueFormatter({ data }) {
    if (typeof data === "number") {
      return data.toString();
    }
    if (typeof data === "string") {
      return data;
    }
    return "";
  }

  valueGetter({ colDef, rowData, context }) {
    const defaultValueGetter = this.defaultValueGetter;
    return "valueGetter" in colDef && typeof colDef.valueGetter === "function"
      ? colDef.valueGetter({ colDef, rowData, context })
      : defaultValueGetter({ colDef, rowData });
  }

  defaultValueGetter({ colDef, rowData }) {
    return rowData[colDef.colId];
  }
}

module.exports = Table;
