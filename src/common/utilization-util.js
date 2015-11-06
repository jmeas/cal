import packingUtil from './packing-util';

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
  },

  // This assigns each utilization in a list a "position." A position
  // is for the graphical representation of a utilization. It determines
  // how far over the utilization is in the list.
  assignPositions(utilizations) {
    return packingUtil({
      rectangles: utilizations,
      startProp: 'firstDayTimestamp',
      endProp: 'lastDayTimestamp'
    });
  }
};

export default visualizationUtil;
