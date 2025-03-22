const Table = require("./Table");

describe("Table.getRowsData", () => {
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

    const data = Table.getRowsData(allRows, COLUMN_TYPES);
    expect(data).toEqual(expectedData);
  });

  it("should handle empty rows", () => {
    const allRows = [];
    const COLUMN_TYPES = {};

    const expectedData = [];

    const data = Table.getRowsData(allRows, COLUMN_TYPES);
    expect(data).toEqual(expectedData);
  });

  it("should handle rows with missing columns", () => {
    const allRows = [
      ["city", "population", "area"],
      ["Shanghai", "24256800"],
      ["Delhi", "16787941", "1484", "11313"],
    ];
    const COLUMN_TYPES = {
      city: "string",
      population: "number",
      area: "number",
    };

    const expectedData = [
      {
        city: "Shanghai",
        population: 24256800,
        area: NaN,
      },
      {
        city: "Delhi",
        population: 16787941,
        area: 1484,
      },
    ];

    const data = Table.getRowsData(allRows, COLUMN_TYPES);
    expect(data).toEqual(expectedData);
  });
});

describe("Table.defaultValueGetter", () => {
  it("should return the correct value from the row", () => {
    const colDef = { colId: "population" };
    const rowData = {
      city: "Shanghai",
      population: 24256800,
      area: 6340,
      density: 3826,
      country: "China",
    };
    const value = Table.prototype.defaultValueGetter({ colDef, rowData });
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
    const value = Table.prototype.defaultValueGetter({ colDef, rowData });
    expect(value).toBeUndefined();
  });
});

describe("Table.valueGetter", () => {
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
    const value = Table.prototype.valueGetter({ colDef, rowData, context });
    expect(value).toBe(24256800);
  });

  it("should return the correct value using custom valueGetter", () => {
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
    const value = Table.prototype.valueGetter({ colDef, rowData, context });
    expect(value).toBe(Math.round((3826 * 100) / 11313));
  });

  it("should return undefined if colId is not provided and no valueGetter", () => {
    const colDef = {};
    const rowData = {
      city: "Shanghai",
      population: 24256800,
      area: 6340,
      density: 3826,
      country: "China",
    };
    const context = {};
    const value = Table.prototype.valueGetter({ colDef, rowData, context });
    expect(value).toBeUndefined();
  });
});

describe("Table.valueFormatter", () => {
  it("should format number values correctly", () => {
    const data = 12345;
    const formattedValue = Table.prototype.valueFormatter({ data });
    expect(formattedValue).toBe("12345");
  });

  it("should format string values correctly", () => {
    const data = "test string";
    const formattedValue = Table.prototype.valueFormatter({ data });
    expect(formattedValue).toBe("test string");
  });

  it("should return an empty string for null values", () => {
    const data = null;
    const formattedValue = Table.prototype.valueFormatter({ data });
    expect(formattedValue).toBe("");
  });

  it("should return an empty string for undefined values", () => {
    const data = undefined;
    const formattedValue = Table.prototype.valueFormatter({ data });
    expect(formattedValue).toBe("");
  });
});

describe("Table.cellRenderer", () => {
  it("should render cell value with default width and alignment", () => {
    const data = "test";
    const renderedValue = Table.prototype.cellRenderer({ data });
    expect(renderedValue).toBe("test      "); // Default width is 10, default alignment is left
  });

  it("should render cell value with specified width (15) and left alignment", () => {
    const data = "test";
    const renderedValue = Table.prototype.cellRenderer({
      data,
      width: 15,
      align: "left",
    });
    expect(renderedValue).toBe("test           ");
  });

  it("should render cell value with specified width (15) and right alignment", () => {
    const data = "test";
    const renderedValue = Table.prototype.cellRenderer({
      data,
      width: 15,
      align: "right",
    });
    expect(renderedValue).toBe("           test"); // Width is 15, alignment is right
  });

  it("should render number value correctly", () => {
    const data = 12345;
    const renderedValue = Table.prototype.cellRenderer({ data });
    expect(renderedValue).toBe("12345     "); // Default width is 10, default alignment is left
  });

  it("should render empty string for null value", () => {
    const data = null;
    const renderedValue = Table.prototype.cellRenderer({ data });
    expect(renderedValue).toBe("          "); // Default width is 10, default alignment is left
  });

  it("should render empty string for undefined value", () => {
    const data = undefined;
    const renderedValue = Table.prototype.cellRenderer({ data });
    expect(renderedValue).toBe("          "); // Default width is 10, default alignment is left
  });
});

describe("Table.rowRenderer", () => {
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
    const renderedRow = Table.prototype.rowRenderer({
      rowData,
      colDefs,
      context,
    });
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
    const renderedRow = Table.prototype.rowRenderer({
      rowData,
      colDefs,
      context,
    });
    expect(renderedRow).toBe(expectedRow);
  });
});
