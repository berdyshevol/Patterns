const DEFAULT_WIDTH = 10;
const DEFAULT_ALIGN = "left";
const DEFAULT_LEFT_PADDING = 0;

const parseLine = (line) => line.split(",").map((c) => c.trim());
const parseCSV = (data) => data.split("\n").map(parseLine);

const transformToRowsData = (allRows) => {
  const [headers, ...rows] = allRows;
  const rowData = [];
  for (const row of rows) {
    const hash = {};
    for (let index = 0; index < headers.length; index++) {
      const header = headers[index];
      const cell = row[index];
      hash[header] = cell;
    }
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

const toValueObject = (value, type) => {
  if (
    value == null ||
    value === undefined ||
    Number.isNaN(value) ||
    value === ""
  ) {
    return { value: undefined, isNull: true };
  }
  const normalizerMap = {
    string: (value) => value,
    number: (value) => Number(value),
    date: (value) => new Date(value),
    boolean: (value) => Boolean(value),
  };
  const normalizer = normalizerMap[type] || normalizerMap.string;
  const normalizedValue = normalizer(value);
  if (Number.isNaN(normalizedValue)) {
    return { value: undefined, isNull: true };
  }
  return {
    value: normalizedValue,
    isNull: false,
  };
};

const getValueFromValueObject = (valueObject) => valueObject.value;

const valueGetter = (params) => {
  const { colDef } = params;
  const value = Object.hasOwn(colDef, "valueGetter")
    ? colDef.valueGetter(params)
    : defaultValueGetter(params);
  return value;
};

const isEmptyValue = (valueObject) => valueObject.isNull;

const defaultValueFormatter = ({ valueObject: { value }, colDef }) => {
  const { type = "string" } = colDef;
  const serializerMap = {
    string: (value) => value.toString(),
    number: (value) => value.toString(),
    default: (value) => value.toString(),
    date: (value) =>
      value.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    boolean: (value) => (value ? "YES" : "NO"),
  };
  const serializer = serializerMap[type] || serializerMap.default;
  return serializer(value);
};

const valueFormatter = (params) => {
  const { valueObject, colDef } = params;
  if (isEmptyValue(valueObject)) return "";

  if (Object.hasOwn(colDef, "valueFormatter")) {
    const value = getValueFromValueObject(params.valueObject);
    return colDef.valueFormatter({ value, ...params });
  }
  return defaultValueFormatter(params);
};

const cellRenderer = (params) => {
  const { width = DEFAULT_WIDTH, align = DEFAULT_ALIGN } = params.colDef;
  const valueStr = valueFormatter(params);
  return align === "left" ? valueStr.padEnd(width) : valueStr.padStart(width);
};

const rowRenderer = (params) =>
  params.gridOptions.colDefs
    .map((colDef) => {
      const value = valueGetter({ colDef, ...params });
      const valueObject = toValueObject(value, colDef.type);
      return cellRenderer({ valueObject, colDef, ...params });
    })
    .join("");

const addPaddings = (str, leftPadding) => `${" ".repeat(leftPadding)}${str}`;

const gridRenderer = ({ rowsDataAfterFilteringAndSorting, gridOptions }) => {
  const { leftPadding = DEFAULT_LEFT_PADDING } = gridOptions;
  const rows = rowsDataAfterFilteringAndSorting.map((rowData) =>
    addPaddings(rowRenderer({ rowData, gridOptions }), leftPadding)
  );

  return rows.join("\n");
};

const sortRowsData = ({ rowsData, sort }) => {
  const ComporatorMap = {
    asc: (a, b) => a[sortKey] - b[sortKey],
    desc: (a, b) => b[sortKey] - a[sortKey],
  };
  if (!sort) return rowsData;
  const [sortKey, sortOrder] = Object.entries(sort)[0];
  const comparator = ComporatorMap[sortOrder] || ComporatorMap.asc;
  return [...rowsData].sort(comparator);
};

const tableRenderer = (gridOptions) => {
  const rowsDataAfterFilteringAndSorting = sortRowsData(gridOptions);
  return gridRenderer({ rowsDataAfterFilteringAndSorting, gridOptions });
};

module.exports = {
  parseCSV,
  transformToRowsData,
  defaultValueGetter,
  valueGetter,
  valueFormatter,
  cellRenderer,
  rowRenderer,
  sortRowsData,
  gridRenderer,
  tableRenderer,
};
