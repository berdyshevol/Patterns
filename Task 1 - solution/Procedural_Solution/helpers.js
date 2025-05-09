const DEFAULT_WIDTH = 10;
const DEFAULT_ALIGN = "left";
const DEFAULT_LEFT_PADDING = 0;

const parseLine = (line) => line.split(",").map((c) => c.trim());
const parseCSV = (data) => data.split("\n").map(parseLine);

const normalizerMap = {
  string: (value) => value,
  number: (value) => Number(value),
};

const getRowsData = (allRows, columnTypes) => {
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

const defaultValueGetter = ({ colDef, rowData }) => rowData[colDef.colId];

const valueGetter = ({ colDef, rowData, context }) =>
  "valueGetter" in colDef && typeof colDef.valueGetter === "function"
    ? colDef.valueGetter({ colDef, rowData, context })
    : defaultValueGetter({ colDef, rowData });

const valueFormatter = ({ data }) => {
  if (typeof data === "number") {
    return data.toString();
  }
  if (typeof data === "string") {
    return data;
  }
  return "";
};

const cellRenderer = ({
  data,
  width = DEFAULT_WIDTH,
  align = DEFAULT_ALIGN,
}) => {
  const strValue = valueFormatter({ data });

  return align === "left" ? strValue.padEnd(width) : strValue.padStart(width);
};

const rowRenderer = ({ rowData, colDefs, context }) =>
  colDefs
    .map((colDef) => {
      const data = valueGetter({ colDef, rowData, context });
      return cellRenderer({ data, ...colDef });
    })
    .join("");

const sortRowsData = (rowsData, sort) => {
  const [sortKey, sortOrder] = Object.entries(sort)[0];
  return rowsData.sort((a, b) =>
    sortOrder === "asc" ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
  );
};

const addPaddings = (str, leftPadding) => `${" ".repeat(leftPadding)}${str}`;

const gridRenderer = ({
  rowsData,
  colDefs,
  context,
  leftPadding = DEFAULT_LEFT_PADDING,
}) => {
  const rows = rowsData.map((rowData) =>
    addPaddings(rowRenderer({ rowData, colDefs, context }), leftPadding)
  );

  return rows.join("\n");
};

const tableRenderer = ({
  rowsData,
  colDefs,
  context,
  sort,
  leftPadding = DEFAULT_LEFT_PADDING,
}) => {
  const sortedRowsData = sortRowsData(rowsData, sort);
  return gridRenderer({
    rowsData: sortedRowsData,
    colDefs,
    context,
    leftPadding,
  });
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
