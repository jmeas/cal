// Quantize a `val` by `quantum`
export default function(val, quantum) {
  return (val - (val % quantum)) / quantum;
}
