const DEFAULT_WIDTH = 10;
const DEFAULT_ALIGN = "left";

const normalizerMap = {
  string: (value) => value,
  number: (value) => Number(value),
};

class Table {
  static getRowsData(allRows, columnTypes) {
    const [headers, ...rows] = allRows;
    const rowData = [];
    for (const row of rows) {
      const hash = {};
      headers.forEach((header, index) => {
        const cell = row[index];
        const type = columnTypes[header];
        const value = normalizerMap[type](cell);
        hash[header] = value;
      });
      rowData.push(hash);
    }
    return rowData;
  }

  constructor({ rowsData, colDefs, context, sort }) {
    this.rowsData = rowsData;
    this.colDefs = colDefs;
    this.context = context;
    this.sort = sort;

    this.render = this.render.bind(this);
    this.sortRowsData = this.sortRowsData.bind(this);
    this.gridRenderer = this.gridRenderer.bind(this);
    this.rowRenderer = this.rowRenderer.bind(this);
    this.valueGetter = this.valueGetter.bind(this);
    this.defaultValueGetter = this.defaultValueGetter.bind(this);
    this.cellRenderer = this.cellRenderer.bind(this);
    this.valueFormatter = this.valueFormatter.bind(this);
  }

  render() {
    const rowsData = this.sortRowsData();
    return this.gridRenderer({ rowsData });
  }

  sortRowsData() {
    const [sortKey, sortOrder] = Object.entries(this.sort)[0];
    return this.rowsData.sort((a, b) =>
      sortOrder === "asc" ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
    );
  }

  gridRenderer({ rowsData }) {
    return rowsData
      .map((rowData) =>
        this.rowRenderer({
          rowData,
          colDefs: this.colDefs,
          context: this.context,
        })
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
