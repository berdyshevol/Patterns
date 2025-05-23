const THRESHOLD = 10;

class Basket {
  constructor({ limit }, callback) {
    this.limit = limit;
    this.callback = callback;
    this.items = [];
    this.total = 0;
    this.errors = [];
    this.exitError = '';
  }

  add(item) {
    if (item.price + this.total < this.limit) {
      this.items.push(item);
      this.total += item.price;
      return true;
    }
    
    if (this.limit - this.total < THRESHOLD) {
      this.exitError = 'Limit reached';
      this.#fireCallback();
      return false;
    }

    this.errors.push(item);
    return true;
  }

  end() {
    this.exitError = 'No more items';
    this.#fireCallback();
  }

  #fireCallback() {
    this.callback({
      items: this.items,
      total: this.total,
      errors: this.errors,
      exitError: this.exitError
    });
  }
}

module.exports = { Basket };
