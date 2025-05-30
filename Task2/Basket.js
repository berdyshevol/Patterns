const THRESHOLD = 10;

class Basket {
  constructor({ limit }, callback) {
    this.limit = limit;
    this.callback = callback;
    this.items = [];
    this.total = 0;
    this.errors = [];
    this.exitStatus = "No more items";
  }

  add(item) {
    if (item.price + this.total < this.limit) {
      this.items.push(item);
      this.total += item.price;
      return true;
    }

    if (this.limit - this.total < THRESHOLD) {
      this.exitStatus = "Limit reached";
      return false;
    }

    this.errors.push(item);
    return true;
  }

  end() {
    this.callback({
      items: this.items,
      total: this.total,
      errors: this.errors,
      exitStatus: this.exitStatus,
    });
  }
}

module.exports = { Basket };
