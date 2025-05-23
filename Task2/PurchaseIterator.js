class PurchaseIterator {
  static create(purchase) {
    const interable = {
       [Symbol.iterator](){
        let i = 0;
        const interator = {
          next() {
            return {
              value: purchase[i++],
              done: i >= purchase.length
            }
          }
        }
        return interator;
       }
    }
    return interable;
  }
}

module.exports = { PurchaseIterator };
