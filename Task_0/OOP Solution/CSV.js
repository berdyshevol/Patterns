class CSV {
  constructor(data) {
    this.str = typeof data === "string" ? data : "";
  }

  parse() {
    const parseLine = this.#parseLine;
    return this.str.split("\n").map(parseLine);
  }

  #parseLine(line) {
    return line.split(",").map((c) => c.trim());
  }
}

module.exports = CSV;
