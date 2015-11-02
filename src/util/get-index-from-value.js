function getIndexFromValue({ value, unitSize, padding, minIndex, maxIndex }) {
  // Quantize the value
  value = value - (value % unitSize);
  // Get the index by dividing by the unitSize, then add padding
  var index = value / unitSize + padding;

  // Ensure we don't surpass the extremities
  if (minIdex) {
    index = index < minIndex ? minIndex : index;
  }
  if (maxIndex) {
    index = index > maxIndex ? maxIndex : index;
  }

  return index;
}

export default getIndexFromValue;
