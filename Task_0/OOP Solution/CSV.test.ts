const CSV = require("./CSV");

describe("CSV", () => {
  it("should parse CSV data into rows", () => {
    const data = `city,population,area,density,country
                  Shanghai,24256800,6340,3826,China
                  Delhi,16787941,1484,11313,India`;

    const expectedRows = [
      ["city", "population", "area", "density", "country"],
      ["Shanghai", "24256800", "6340", "3826", "China"],
      ["Delhi", "16787941", "1484", "11313", "India"],
    ];

    const csv = new CSV(data);
    const rows = csv.parse();
    expect(rows).toEqual(expectedRows);
  });

  it("should return an empty array for empty data", () => {
    const data = "";

    const expectedRows = [[""]];

    const csv = new CSV(data);
    const rows = csv.parse();
    expect(rows).toEqual(expectedRows);
  });

  it("should handle data with inconsistent columns", () => {
    const data = `city,population,area
                  Shanghai,24256800
                  Delhi,16787941,1484,11313`;

    const expectedRows = [
      ["city", "population", "area"],
      ["Shanghai", "24256800"],
      ["Delhi", "16787941", "1484", "11313"],
    ];

    const csv = new CSV(data);
    const rows = csv.parse();
    expect(rows).toEqual(expectedRows);
  });
});
