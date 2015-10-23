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

export default function(start, length, scale = 'days') {
  // The number of days that we add for the scale
  var diffUnit = dateMap[scale];
  var dates = [];
  var potentialDate, toAdd;
  for (var i = 0; i <= length; i++) {
    toAdd = i * diffUnit;
    potentialDate = cloneDate(start);
    // Update our date appropriately
    potentialDate.setDate(potentialDate.getDate() + toAdd);
    if (scale === 'days' && isWeekend(potentialDate)) {
      continue;
    }
    dates.push(potentialDate);
  }
  return dates;
};
