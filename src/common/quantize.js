// Quantize a `val` by `quantum`
export default function(val, quantum, {cover = false} = {}) {
  // The `cover` option determines if we're using a covering or a fitting algorithm
  var remainder = (val % quantum);
  var mod = cover && remainder ? 1 : 0;
  return (val - remainder) / quantum + mod;
}
