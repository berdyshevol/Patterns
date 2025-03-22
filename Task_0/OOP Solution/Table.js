const normalizerMap = {
  string: (value) => value,
  number: (value) => Number(value),
};

class Table {
  static getRowsData(allRows, columnTypes) {
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
  }
}

module.exports = Table;
