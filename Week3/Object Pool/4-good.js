"use strict";

const poolify = (factory, options, size, max) => {
  const createInstance = (options) => factory(...options);

  const instances = new Array(size)
    .fill(null)
    .map(() => createInstance(options));

  const acquire = () => instances.pop() || createInstance(options);

  const release = (instance) => {
    if (instances.length < max) {
      instances.push(instance);
    }
  };

  return { acquire, release };
};

// Usage

const createBuffer = (size) => new Uint8Array(size);
const pool = poolify(createBuffer, [4096], 10, 15);

const instance = pool.acquire();
console.log({ instance });
pool.release(instance);
