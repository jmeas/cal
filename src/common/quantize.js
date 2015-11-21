// Quantize a `val` by `quantum`
export default function(val, quantum, {cover = false} = {}) {
  // The `cover` option determines if we're using a covering or a fitting algorithm
  var mod = cover ? 1 : 0;
  return (val - (val % quantum)) / quantum + mod;
}
