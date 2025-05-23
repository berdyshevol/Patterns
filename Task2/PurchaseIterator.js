class PurchaseIterator {
  static create(purchase) {
    const interable = {
       [Symbol.asyncIterator](){
        let i = 0;
        const interator = {
          next() {
            return Promise.resolve({
              value: purchase[i++],
              done: i >= purchase.length
            });
          }
        }
        return interator;
       }
    }
    return interable;
  }
}

module.exports = { PurchaseIterator };
