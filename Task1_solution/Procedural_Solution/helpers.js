const DEFAULT_WIDTH = 10;
const DEFAULT_ALIGN = "left";
const DEFAULT_LEFT_PADDING = 0;

const parseLine = (line) => line.split(",").map((c) => c.trim());
const parseCSV = (data) => data.split("\n").map(parseLine);

const getRowsData = (allRows, columnTypes) => {
  const normalizerMap = {
    string: (value) => value,
    number: (value) => Number(value),
  };
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
};

const defaultValueGetter = ({ rowData, colDef }) => {
  if (!Object.hasOwn(colDef, "colId")) {
    throw new Error("colId or valueGetter is required in colDef");
  }
  return rowData[colDef.colId];
};

const valueGetter = (params) => {
  const { colDef } = params;
  const { valueGetter } = colDef;
  if (typeof valueGetter === "function") {
    return colDef.valueGetter(params);
  }
  return defaultValueGetter(params);
};

const isEmptyValue = (value) =>
  value == null || value === undefined || Number.isNaN(value);

const defaultValueFormatter = ({ value, colDef }) => {
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

const valueFormatter = (params) => {
  const { value, colDef } = params;
  if (isEmptyValue(value)) return "";

  const { valueFormatter } = colDef;
  if (typeof valueFormatter === "function") {
    return colDef.valueFormatter(params);
  }
  return defaultValueFormatter(params);
};

const cellRenderer = (params) => {
  const { width = DEFAULT_WIDTH, align = DEFAULT_ALIGN } = params.colDef;
  const valueStr = valueFormatter(params);

  return align === "left" ? valueStr.padEnd(width) : valueStr.padStart(width);
};

const rowRenderer = (params) =>
  params.colDefs
    .map((colDef) => {
      const value = valueGetter({ colDef, ...params });
      return cellRenderer({ value, colDef, ...params });
    })
    .join("");

const sortRowsData = ({ rowsData, sort }) => {
  const [sortKey, sortOrder] = Object.entries(sort)[0];
  return rowsData.sort((a, b) =>
    sortOrder === "asc" ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
  );
};

const addPaddings = (str, leftPadding) => `${" ".repeat(leftPadding)}${str}`;

const gridRenderer = (gridOptions) => {
  const { rowsData, leftPadding = DEFAULT_LEFT_PADDING } = gridOptions;
  const rows = rowsData.map((rowData) =>
    addPaddings(rowRenderer({ rowData, ...gridOptions }), leftPadding)
  );

  return rows.join("\n");
};

const tableRenderer = (gridOptions) => {
  const sortedRowsData = sortRowsData(gridOptions);
  return gridRenderer({ rowsData: sortedRowsData, ...gridOptions });
};

module.exports = {
  parseCSV,
  getRowsData,
  defaultValueGetter,
  valueGetter,
  valueFormatter,
  cellRenderer,
  rowRenderer,
  sortRowsData,
  gridRenderer,
  tableRenderer,
};
