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
