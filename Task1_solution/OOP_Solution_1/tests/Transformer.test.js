const Transformer = require("../Transformer");

describe("rowsData", () => {
  it("should normalize table data", () => {
    const allRows = `city,population,area,density,country
      Shanghai,24256800,6340,3826,China
      Delhi,16787941,1484,11313,India`;

    const SCHEMA = {
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

    const data = new Transformer(allRows).rowsData(SCHEMA);
    expect(data).toEqual(expectedData);
  });

  it("should handle empty string", () => {
    const allRows = "";
    const SCHEMA = {};

    const expectedData = [];

    const data = new Transformer(allRows).rowsData(SCHEMA);
    expect(data).toEqual(expectedData);
  });

  it("should throw error for unknown type in schema", () => {
    const allRows = `city,population
      Shanghai,24256800
      Delhi,16787941`;
    const SCHEMA = {
      city: "string",
      population: "float", // unsupported type
    };

    expect(() => {
      new Transformer(allRows).rowsData(SCHEMA);
    }).toThrow(new Error("Unknown type: float"));
  });

  it("should handle null values for empty cells", () => {
    const allRows = `city,population,area
      Shanghai,24256800,
      Delhi,,1484`;
    const SCHEMA = {
      city: "string",
      population: "number",
      area: "number",
    };

    const expectedData = [
      {
        city: "Shanghai",
        population: 24256800,
        area: null,
      },
      {
        city: "Delhi",
        population: null,
        area: 1484,
      },
    ];

    const data = new Transformer(allRows).rowsData(SCHEMA);
    expect(data).toEqual(expectedData);
  });

  it("should handle date type normalization", () => {
    const allRows = `city,established
      Shanghai,1291-01-01
      Delhi,1052-01-01`;
    const SCHEMA = {
      city: "string",
      established: "date",
    };

    const data = new Transformer(allRows).rowsData(SCHEMA);
    expect(data[0].established).toBeInstanceOf(Date);
    expect(data[1].established).toBeInstanceOf(Date);
    expect(data[0].established.getUTCFullYear()).toBe(1291);
    expect(data[1].established.getUTCFullYear()).toBe(1052);
  });

  it("should return empty array if only headers are present", () => {
    const allRows = `city,population,area`;
    const SCHEMA = {
      city: "string",
      population: "number",
      area: "number",
    };

    const data = new Transformer(allRows).rowsData(SCHEMA);
    expect(data).toEqual([]);
  });

  it("should throw error if schema is missing a header type", () => {
    const allRows = `city,population,area
      Shanghai,24256800,6340`;
    const SCHEMA = {
      city: "string",
      population: "number",
      // area is missing
    };

    expect(() => {
      new Transformer(allRows).rowsData(SCHEMA);
    }).toThrow(new Error("Unknown type: undefined"));
  });
});
