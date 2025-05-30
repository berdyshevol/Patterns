class ValueGetter {
  #rowNode = null;

  #colDef = null;

  constructor(rowNode, colDef) {
    this.#colDef = colDef;
    this.#rowNode = rowNode;
  }

  value() {
    return typeof this.#colDef.valueGetter === "function"
      ? this.#colDef.valueGetter({
          colDef: this.#colDef,
          rowData: this.#rowNode.rowData,
          gridOptions: this.#rowNode.gridOptions,
        })
      : this.#defaultValueGetter();
  }

  #defaultValueGetter() {
    return this.#rowNode.getValueByColId(this.#colDef.colId);
  }
}

module.exports = ValueGetter;
