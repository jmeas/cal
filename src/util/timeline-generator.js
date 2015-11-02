const dateMap = {
  days: 1,
  weeks: 7
};

function isWeekend(date) {
  return date.getDay() == 6 || date.getDay() == 0;
}

function cloneDate(date) {
  return new Date(date.getTime());
}

export default function({ referenceDate, back, forward, scale = 'days' }) {
  var length = back + forward;
  // The number of days that we add for the scale
  var diffUnit = dateMap[scale];
  var dates = [];
  var potentialDate, toAdd;
  var i = 0;
  var index = 0;
  // Create the starting date from our reference date
  var start = cloneDate(referenceDate);
  start.setDate(referenceDate.getDate() - diffUnit * back);
  while (i < length) {
    toAdd = index * diffUnit;
    potentialDate = cloneDate(start);
    // Update our date appropriately.
    potentialDate.setDate(start.getDate() + toAdd);
    // Ignore weekends
    var isDays = scale === 'days';
    var isAWeekend = isWeekend(potentialDate);
    if (!isDays || (isDays && !isAWeekend)) {
      dates.push({time: potentialDate});
      i++;
    }
    index++;
  }
  return dates;
};
