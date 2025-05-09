const {
  parseCSV,
  getRowsData,
  defaultValueGetter,
  valueGetter,
  valueFormatter,
  cellRenderer,
  rowRenderer,
  gridRenderer,
  sortRowsData,
} = require("./helpers");

describe("parseCSV", () => {
  it("should parse CSV data into rows", () => {
    const data = `city,population,area,density,country
                  Shanghai,24256800,6340,3826,China
                  Delhi,16787941,1484,11313,India`;

    const expectedRows = [
      ["city", "population", "area", "density", "country"],
      ["Shanghai", "24256800", "6340", "3826", "China"],
      ["Delhi", "16787941", "1484", "11313", "India"],
    ];

    const rows = parseCSV(data);
    expect(rows).toEqual(expectedRows);
  });
});

describe("getRowsData", () => {
  it("should normalize table data", () => {
    const allRows = [
      ["city", "population", "area", "density", "country"],
      ["Shanghai", "24256800", "6340", "3826", "China"],
      ["Delhi", "16787941", "1484", "11313", "India"],
    ];
    const COLUMN_TYPES = {
      city: "string",
      population: "number",
      area: "number",
      density: "number",
      country: "string",
    };

    const expectedData = [
      {
        city: "Shanghai",
        population: 24256800,
        area: 6340,
        density: 3826,
        country: "China",
      },
      {
        city: "Delhi",
        population: 16787941,
        area: 1484,
        density: 11313,
        country: "India",
      },
    ];

    const data = getRowsData(allRows, COLUMN_TYPES);
    expect(data).toEqual(expectedData);
  });
});

describe("defaultValueGetter", () => {
  it("should return the correct value from the row", () => {
    const colDef = { colId: "population" };
    const rowData = {
      city: "Shanghai",
      population: 24256800,
      area: 6340,
      density: 3826,
      country: "China",
    };
    const value = defaultValueGetter({ colDef, rowData });
    expect(value).toBe(24256800);
  });

  it("should return undefined if the column ID does not exist in the row", () => {
    const colDef = { colId: "nonexistent" };
    const rowData = {
      city: "Shanghai",
      population: 24256800,
      area: 6340,
      density: 3826,
      country: "China",
    };
    const value = defaultValueGetter({ colDef, rowData });
    expect(value).toBeUndefined();
  });
});

describe("valueGetter", () => {
  it("should return the correct value using defaultValueGetter", () => {
    const colDef = { colId: "population" };
    const rowData = {
      city: "Shanghai",
      population: 24256800,
      area: 6340,
      density: 3826,
      country: "China",
    };
    const context = {};
    const value = valueGetter({ colDef, rowData, context });
    expect(value).toBe(24256800);
  });

  it("should return the correct value using valueGetter", () => {
    const colDef = {
      colId: "densityPercentage",
      valueGetter: ({ rowData, context }) =>
        Math.round((rowData.density * 100) / context.maxDensity),
    };
    const rowData = {
      city: "Shanghai",
      population: 24256800,
      area: 6340,
      density: 3826,
      country: "China",
    };
    const context = { maxDensity: 11313 };
    const value = valueGetter({ colDef, rowData, context });
    expect(value).toBe(Math.round((3826 * 100) / 11313));
  });

  it("should return undefined if colId is not provided and no valueRenderer", () => {
    const colDef = {};
    const rowData = {
      city: "Shanghai",
      population: 24256800,
      area: 6340,
      density: 3826,
      country: "China",
    };
    const context = {};
    const value = valueGetter({ colDef, rowData, context });
    expect(value).toBeUndefined();
  });
});

describe("valueFormatter", () => {
  it("should format number values correctly", () => {
    const data = 12345;
    const formattedValue = valueFormatter({ data });
    expect(formattedValue).toBe("12345");
  });

  it("should format string values correctly", () => {
    const data = "test string";
    const formattedValue = valueFormatter({ data });
    expect(formattedValue).toBe("test string");
  });

  it("should return an empty string for null values", () => {
    const data = null;
    const formattedValue = valueFormatter({ data });
    expect(formattedValue).toBe("");
  });

  it("should return an empty string for undefined values", () => {
    const data = undefined;
    const formattedValue = valueFormatter({ data });
    expect(formattedValue).toBe("");
  });
});

describe("cellRenderer", () => {
  it("should render cell value with default width and alignment", () => {
    const data = "test";
    const renderedValue = cellRenderer({ data });
    expect(renderedValue).toBe("test      "); // Default width is 10, default alignment is left
  });

  it("should render cell value with specified width (15) and left alignment", () => {
    const data = "test";
    const renderedValue = cellRenderer({ data, width: 15, align: "left" });
    expect(renderedValue).toBe("test           ");
  });

  it("should render cell value with specified width (15) and right alignment", () => {
    const data = "test";
    const renderedValue = cellRenderer({ data, width: 15, align: "right" });
    expect(renderedValue).toBe("           test"); // Width is 15, alignment is right
  });

  it("should render number value correctly", () => {
    const data = 12345;
    const renderedValue = cellRenderer({ data });
    expect(renderedValue).toBe("12345     "); // Default width is 10, default alignment is left
  });

  it("should render empty string for null value", () => {
    const data = null;
    const renderedValue = cellRenderer({ data });
    expect(renderedValue).toBe("          "); // Default width is 10, default alignment is left
  });

  it("should render empty string for undefined value", () => {
    const data = undefined;
    const renderedValue = cellRenderer({ data });
    expect(renderedValue).toBe("          "); // Default width is 10, default alignment is left
  });
});

describe("rowRenderer", () => {
  it("should render a row with specified column definitions", () => {
    const rowData = {
      city: "Shanghai",
      population: 24256800,
      area: 6340,
      density: 3826,
      country: "China",
    };
    const colDefs = [
      { colId: "city", width: 18, align: "right" },
      { colId: "population", width: 10, align: "left" },
      { colId: "area", width: 8, align: "left" },
      { colId: "density", width: 8, align: "left" },
      { colId: "country", width: 18, align: "right" },
    ];
    const context = {};

    const expectedRow =
      "          Shanghai24256800  6340    3826                 China";
    const renderedRow = rowRenderer({ rowData, colDefs, context });
    expect(renderedRow).toBe(expectedRow);
  });

  it("should render a row with custom valueGetter", () => {
    const rowData = {
      city: "Shanghai",
      population: 24256800,
      area: 6340,
      density: 3826,
      country: "China",
    };
    const colDefs = [
      { colId: "city", width: 18, align: "right" },
      { colId: "population", width: 10, align: "left" },
      { colId: "area", width: 8, align: "left" },
      { colId: "density", width: 8, align: "left" },
      { colId: "country", width: 18, align: "right" },
      {
        colId: "densityPercentage",
        width: 6,
        align: "left",
        valueGetter: ({ rowData, context }) =>
          Math.round((rowData.density * 100) / context.maxDensity),
      },
    ];
    const context = { maxDensity: 11313 };

    const expectedRow =
      "          Shanghai24256800  6340    3826                 China34    ";
    const renderedRow = rowRenderer({ rowData, colDefs, context });
    expect(renderedRow).toBe(expectedRow);
  });
});

describe("sortRowsData", () => {
  it("should sort rows data in ascending order", () => {
    const rowsData = [
      { city: "Shanghai", population: 24256800 },
      { city: "Delhi", population: 16787941 },
      { city: "Tokyo", population: 13513734 },
    ];
    const sort = { population: "asc" };

    const expectedSortedData = [
      { city: "Tokyo", population: 13513734 },
      { city: "Delhi", population: 16787941 },
      { city: "Shanghai", population: 24256800 },
    ];

    const sortedData = sortRowsData(rowsData, sort);
    expect(sortedData).toEqual(expectedSortedData);
  });

  it("should sort rows data in descending order", () => {
    const rowsData = [
      { city: "Shanghai", population: 24256800 },
      { city: "Delhi", population: 16787941 },
      { city: "Tokyo", population: 13513734 },
    ];
    const sort = { population: "desc" };

    const expectedSortedData = [
      { city: "Shanghai", population: 24256800 },
      { city: "Delhi", population: 16787941 },
      { city: "Tokyo", population: 13513734 },
    ];

    const sortedData = sortRowsData(rowsData, sort);
    expect(sortedData).toEqual(expectedSortedData);
  });
});

describe("gridRenderer", () => {
  it("should render the table with specified column definitions", () => {
    const rowsData = [
      {
        city: "Shanghai",
        population: 24256800,
        area: 6340,
        density: 3826,
        country: "China",
      },
      {
        city: "Delhi",
        population: 16787941,
        area: 1484,
        density: 11313,
        country: "India",
      },
    ];
    const colDefs = [
      { colId: "city", width: 18, align: "right" },
      { colId: "population", width: 10, align: "left" },
      { colId: "area", width: 8, align: "left" },
      { colId: "density", width: 8, align: "left" },
      { colId: "country", width: 18, align: "right" },
      {
        colId: "densityPercentage",
        width: 6,
        align: "left",
        valueGetter: ({ rowData, context }) =>
          Math.round((rowData.density * 100) / context.maxDensity),
      },
    ];
    const context = { maxDensity: 11313 };

    const expectedTable =
      "          Shanghai24256800  6340    3826                 China34    \n" +
      "             Delhi16787941  1484    11313                India100   ";
    const renderedTable = gridRenderer({ rowsData, colDefs, context });
    expect(renderedTable).toBe(expectedTable);
  });
});
