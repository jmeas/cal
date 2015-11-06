import _ from 'lodash';

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
    var activePositions = [];

    _.each(utilizations, u => {
      // If there's no initial position, then we assign this utilization
      // to be the first.
      if (!activePositions[0]) {
        u.position = 0;
        activePositions[0] = u;
        return;
      }

      // Find the first active position that our utilization is after.
      // Once found, set the position.
      _.each(activePositions, (p, i) => {
        if (utilizationUtil.isAfter(p, u)) {
          u.position = i;
          activePositions[i] = u;
          return false;
        }
      });

      // If we found a position, then we exit
      if (u.position) { return; }

      // Otherwise, we must create a new column for this utilization
      u.position = activePositions.length;
      activePositions[activePositions.length] = u;
    });

    return utilizations;
  }
};

export default visualizationUtil;
