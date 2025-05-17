const {
  parseCSV,
  transformToRowsData,
  defaultValueGetter,
  valueGetter,
  valueFormatter,
  cellRenderer,
  rowRenderer,
  gridRenderer,
  sortRowsData,
  tableRenderer,
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

describe("transformToRowsData", () => {
  it("should normalize table data", () => {
    const allRows = [
      ["city", "population", "area", "density", "country"],
      ["Shanghai", "24256800", "6340", "3826", "China"],
      ["Delhi", "16787941", "1484", "11313", "India"],
    ];

    const expectedData = [
      {
        city: "Shanghai",
        population: "24256800",
        area: "6340",
        density: "3826",
        country: "China",
      },
      {
        city: "Delhi",
        population: "16787941",
        area: "1484",
        density: "11313",
        country: "India",
      },
    ];

    const data = transformToRowsData(allRows);
    expect(data).toEqual(expectedData);
  });
});

// describe("defaultValueGetter", () => {
//   it("should return the correct value from the row", () => {
//     const colDef = { colId: "population" };
//     const rowData = {
//       city: "Shanghai",
//       population: 24256800,
//       area: 6340,
//       density: 3826,
//       country: "China",
//     };
//     const value = defaultValueGetter({ colDef, rowData });
//     expect(value).toBe(24256800);
//   });

//   it("should return undefined if the column ID does not exist in the row", () => {
//     const colDef = { colId: "nonexistent" };
//     const rowData = {
//       city: "Shanghai",
//       population: 24256800,
//       area: 6340,
//       density: 3826,
//       country: "China",
//     };
//     const value = defaultValueGetter({ colDef, rowData });
//     expect(value).toBeUndefined();
//   });
// });

// describe("valueGetter", () => {
//   it("should return the correct value using defaultValueGetter", () => {
//     const colDef = { colId: "population" };
//     const rowData = {
//       city: "Shanghai",
//       population: 24256800,
//       area: 6340,
//       density: 3826,
//       country: "China",
//     };
//     const context = {};
//     const value = valueGetter({ colDef, rowData, context });
//     expect(value).toBe(24256800);
//   });

//   it("should return the correct value using valueGetter", () => {
//     const colDef = {
//       colId: "densityPercentage",
//       valueGetter: ({ rowData, context }) =>
//         Math.round((rowData.density * 100) / context.maxDensity),
//     };
//     const rowData = {
//       city: "Shanghai",
//       population: 24256800,
//       area: 6340,
//       density: 3826,
//       country: "China",
//     };
//     const context = { maxDensity: 11313 };
//     const value = valueGetter({ colDef, rowData, context });
//     expect(value).toBe(Math.round((3826 * 100) / 11313));
//   });

//   it("should throw error if neither colId nor valueGetter are provided", () => {
//     const colDef = {};
//     const rowData = {
//       city: "Shanghai",
//       population: 24256800,
//       area: 6340,
//       density: 3826,
//       country: "China",
//     };
//     const context = {};
//     expect(() => {
//       valueGetter({ colDef, rowData, context });
//     }).toThrow("colId or valueGetter is required in colDef");
//   });
// });

// describe("valueFormatter", () => {
//   it("should format number values correctly", () => {
//     const value = 12345;
//     const colDef = { type: "number" };
//     const formattedValue = valueFormatter({ value, colDef });
//     expect(formattedValue).toBe("12345");
//   });

//   it("should format string values correctly", () => {
//     const value = "test string";
//     const colDef = { type: "string" };
//     const formattedValue = valueFormatter({ value, colDef });
//     expect(formattedValue).toBe("test string");
//   });

//   it("should return an empty string for null values", () => {
//     const value = null;
//     const colDef = { type: "something" };
//     const formattedValue = valueFormatter({ value, colDef });
//     expect(formattedValue).toBe("");
//   });

//   it("should return an empty string for undefined values", () => {
//     const value = undefined;
//     const colDef = { type: "something" };
//     const formattedValue = valueFormatter({ value, colDef });
//     expect(formattedValue).toBe("");
//   });
// });

// describe("cellRenderer", () => {
//   it("should render cell value with default width and alignment", () => {
//     const value = "test";
//     const colDef = {};
//     const rowData = {};
//     const context = {};
//     const rowsData = [];
//     const renderedValue = cellRenderer({
//       value,
//       colDef,
//       rowData,
//       context,
//       rowsData,
//     });
//     expect(renderedValue).toBe("test      "); // Default width is 10, default alignment is left
//   });

//   it("should render cell value with specified width (15) and left alignment", () => {
//     const value = "test";
//     const colDef = { width: 15, align: "left" };
//     const rowData = {};
//     const context = {};
//     const rowsData = [];
//     const renderedValue = cellRenderer({
//       value,
//       rowData,
//       colDef,
//       context,
//       rowsData,
//     });
//     expect(renderedValue).toBe("test           ");
//   });

//   it("should render cell value with specified width (15) and right alignment", () => {
//     const value = "test";
//     const colDef = { value, width: 15, align: "right" };
//     const rowData = {};
//     const context = {};
//     const rowsData = [];
//     const renderedValue = cellRenderer({
//       value,
//       rowData,
//       colDef,
//       context,
//       rowsData,
//     });
//     expect(renderedValue).toBe("           test"); // Width is 15, alignment is right
//   });

//   it("should render number value correctly", () => {
//     const value = 12345;
//     const colDef = { type: "number" };
//     const rowData = {};
//     const context = {};
//     const rowsData = [];
//     const renderedValue = cellRenderer({
//       value,
//       rowData,
//       colDef,
//       context,
//       rowsData,
//     });
//     expect(renderedValue).toBe("12345     "); // Default width is 10, default alignment is left
//   });

//   it("should render empty string for null value", () => {
//     const value = null;
//     const rowData = {};
//     const colDef = {};
//     const context = {};
//     const rowsData = [];
//     const renderedValue = cellRenderer({
//       value,
//       rowsData,
//       colDef,
//       context,
//       rowData,
//     });
//     expect(renderedValue).toBe("          "); // Default width is 10, default alignment is left
//   });
//   it("should render empty string for empty string value", () => {
//     const value = "";
//     const colDef = {};
//     const rowData = {};
//     const context = {};
//     const rowsData = [];
//     const renderedValue = cellRenderer({
//       value,
//       rowData,
//       colDef,
//       context,
//       rowsData,
//     });
//     expect(renderedValue).toBe("          "); // Default width is 10, default alignment is left
//   });
//   it("should render empty string for NaN value", () => {
//     const value = NaN;
//     const colDef = {};
//     const rowData = {};
//     const context = {};
//     const rowsData = [];
//     const renderedValue = cellRenderer({
//       value,
//       rowData,
//       colDef,
//       context,
//       rowsData,
//     });
//     expect(renderedValue).toBe("          "); // Default width is 10, default alignment is left
//   });
//   it("should render empty string for boolean value", () => {
//     const value = true;
//     const colDef = {};
//     const rowData = {};
//     const context = {};
//     const rowsData = [];
//     const renderedValue = cellRenderer({
//       value,
//       rowData,
//       colDef,
//       context,
//       rowsData,
//     });
//     expect(renderedValue).toBe("true      "); // Default width is 10, default alignment is left
//   });
//   it("should render empty string for undefined value", () => {
//     const value = undefined;
//     const colDef = {};
//     const renderedValue = cellRenderer({ value, colDef });
//     expect(renderedValue).toBe("          "); // Default width is 10, default alignment is left
//   });
// });

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
    const renderedRow = rowRenderer({
      rowData,
      gridOptions: {
        colDefs,
        context,
        rowsData: [rowData],
      },
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
        valueGetter: ({ rowData, gridOptions: { context } }) =>
          Math.round((rowData.density * 100) / context.maxDensity),
      },
    ];
    const context = { maxDensity: 11313 };

    const expectedRow =
      "          Shanghai24256800  6340    3826                 China34    ";
    const renderedRow = rowRenderer({
      rowData,
      gridOptions: {
        colDefs,
        context,
        rowsData: [rowData],
      },
    });
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

    const sortedData = sortRowsData({ rowsData, sort });
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

    const sortedData = sortRowsData({ rowsData, sort });
    expect(sortedData).toEqual(expectedSortedData);
  });
});

describe("gridRenderer", () => {
  it("should render the table with specified column definitions", () => {
    const rowsDataAfterFilteringAndSorting = [
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
        valueGetter: ({ rowData, gridOptions: { context } }) =>
          Math.round((rowData.density * 100) / context.maxDensity),
      },
    ];
    const context = { maxDensity: 11313 };

    const expectedTable =
      "          Shanghai24256800  6340    3826                 China34    \n" +
      "             Delhi16787941  1484    11313                India100   ";
    const renderedTable = gridRenderer({
      rowsDataAfterFilteringAndSorting,
      gridOptions: { colDefs, context },
    });
    expect(renderedTable).toBe(expectedTable);
  });
});

describe('tableRenderer with leftPadding', () => {
  it('should render the table with leftPadding', () => {
    const rowsData = [
      { city: "Shanghai", population: 24256800 },
      { city: "Delhi", population: 16787941 },
    ];
    const colDefs = [
      { colId: "city", width: 10, align: "left" },
      { colId: "population", width: 10, align: "left" },
    ];
    const context = {};

    const expectedTable =
      "  Shanghai  24256800  \n" +
      "  Delhi     16787941  ";
    const renderedTable = tableRenderer({
      rowsData,
      colDefs,
      context,
      leftPadding: 2,
    });
    expect(renderedTable).toBe(expectedTable);
  });
})

describe("tableRenderer with colDef.width", () => {
  it("should render the table with colDef.width", () => {
    const rowsData = [
      { city: "Shanghai", population: 24256800 },
      { city: "Delhi", population: 16787941 },
    ];
    const colDefs = [
      { colId: "city", width: 20, align: "left" },
      { colId: "population", width: 10, align: "left" },
    ];
    const context = {};

    const expectedTable =
      "Shanghai            24256800  \n" +
      "Delhi               16787941  ";
    const renderedTable = tableRenderer({
      rowsData,
      colDefs,
      context,
    });
    expect(renderedTable).toBe(expectedTable);
  });
})

describe("tableRenderer with colDef.align", () => {
  it("should render the table with colDef.align", () => {
    const rowsData = [
      { city: "Shanghai", population: 24256800 },
      { city: "Delhi", population: 16787941 },
    ];
    const colDefs = [
      { colId: "city", width: 10, align: "right" },
      { colId: "population", width: 10, align: "left" },
    ];
    const context = {};

    const expectedTable =
      "  Shanghai24256800  \n" +
      "     Delhi16787941  ";
    const renderedTable = tableRenderer({
      rowsData,
      colDefs,
      context,
    });
    expect(renderedTable).toBe(expectedTable);
  });
})

describe("tableRenderer with date", () => {
  it("should render the table with date column", () => {
    const rowsData = [
      {
        field1: "2023-10-01",
        field2: new Date("2023-10-01"),
        field3: "2023-10-01",
      },
    ];
    const colDefs = [
      { colId: "field1", type: "date", width: 20 },
      { colId: "field2", type: "date", width: 20 },
      { colId: "field3", type: "date", width: 20, valueFormatter: ({ value }) => value.toLocaleString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }), },
    ];
    const expectedTable = "September 30, 2023  September 30, 2023  30 Sept 2023        ";
    const renderedTable = tableRenderer({
      rowsData,
      colDefs,
    });
    expect(renderedTable).toBe(expectedTable);
  });
});
