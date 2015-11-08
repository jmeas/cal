import packingUtil from './packing-util';

// These are inclusive start, inclusive end algorithms, because
// they work with utilizations, which have inclusive boundaries.
// Note that this behavior is different from dateUtil!
var utilizationUtil = {
  // Whether or not utilization `one` overlaps with utilization `two`
  overlap(one, two) {
    var conditionOne = one.lastDayTimestamp > two.firstDayTimestamp;
    var conditionTwo = one.firstDayTimestamp < two.lastDayTimestamp;
    return conditionOne && conditionTwo;
  },

  // Whether `two` is after `one`.
  isAfter(one, two) {
    return two.firstDayTimestamp > one.lastDayTimestamp;
  },

  // Whether `two` is after `one`
  isBefore(one, two) {
    return two.lastDayTimestamp < one.firstDayTimestamp;
  }
};

export default utilizationUtil;
