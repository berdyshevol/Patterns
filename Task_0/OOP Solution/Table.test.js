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
