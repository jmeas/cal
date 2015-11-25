import dateUtil from '../common/date-util';

const dateMap = {
  days: 1,
  weeks: 7
};

export default function({ referenceDate, back, forward, scale }) {
  // The "1" here accounts for the referenceDate itself.
  var length = back + forward + 1;
  // The number of days that we add for the scale
  var diffUnit = dateMap[scale];
  var dates = [];
  var potentialDate, toAdd;
  var i = 0;
  var index = 0;
  // Create the starting date from our reference date
  var start = dateUtil.cloneDate(referenceDate);
  // This assumes that the `back` is right, but it is not. It needs
  // to take into account weekends when in day mode
  var method = scale === 'days' ? 'subtractWeekDays' : 'subtractDays';
  var amount = diffUnit * back;
  start = dateUtil[method](start, amount);
  while (i < length) {
    toAdd = index * diffUnit;
    potentialDate = dateUtil.cloneDate(start);
    // Update our date appropriately.
    potentialDate.setDate(start.getDate() + toAdd);
    // Ignore weekends
    var isDays = scale === 'days';
    var isAWeekend = dateUtil.isWeekendDay(potentialDate);
    if (!isDays || (isDays && !isAWeekend)) {
      dates.push({time: potentialDate});
      i++;
    }
    index++;
  }
  return dates;
}
