const { performance } = require('perf_hooks');

console.log(performance);

let iterations = 1e7;
const add = (x, y) => x + y;

performance.mark('bench-start');

while (iterations--) {
    add(iterations, iterations);
}

performance.mark('bench-end');

performance.measure('Benchmark', 'bench-start', 'bench-end');
const [ measure ] = performance.getEntriesByName('Benchmark');
console.log(measure);
