// Ensure `number` is between `min` and `max`
export default function (number, min, max) {
  if (number < min) {
    return min;
  }

  if (number > max) {
    return max;
  }

  return number;
}
