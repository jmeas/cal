import containedPeriodicValues from 'contained-periodic-values';

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const monthNames = [
  'January', 'February', 'March',
  'April', 'May', 'June', 'July',
  'August', 'September', 'October',
  'November', 'December'
];

// These are used by `dateUtil.format()`
const formatMethods = {
  // 2015-10-11
  iso(dd, mm, y) {
    return `${y}-${mm + 1}-${dd}`;
  },

  // Oct 22, 2015
  word(dd, mm, y) {
    var month = monthNames[mm].slice(0, 3);
    return `${month} ${dd}, ${y}`;
  }
};

// These are useful Date-related functions
var dateUtil = {
  // Returns a clone of `date`
  cloneDate(date) {
    return new Date(date.getTime());
  },

  // Return `date` coerced to UTC
  utc(date) {
    date = dateUtil.cloneDate(date);
    return date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  },

  // The number of days between `dateOne` and `dateTwo`
  daysBetween(dateOne, dateTwo) {
    dateOne = utc(dateOne);
    dateTwo = utc(dateTwo);
    return (dateTwo - dateOne) / MILLISECONDS_PER_DAY;
  },

  // The number of US week days between `dateOne` and `dateTwo`
  weekDaysBetween(dateOne, dateTwo) {
    var startDay = dateOne.getDay();
    var totalDays = Math.abs(dateUtil.daysBetween(dateTwo, dateOne));
    var containedSundays = containedPeriodicValues(startDay, totalDays + startDay, 0, 7);
    var containedSaturdays = containedPeriodicValues(startDay, totalDays + startDay, 6, 7);
    return totalDays - (containedSaturdays + containedSundays);
  },

  // The number of weekend days between `dateOne` and `dateTwo`. Always positive
  weekendDaysBetween(dateOne, dateTwo) {
    var totalDaysBetween = dateUtil.daysBetween(dateTwo, dateOne);
    var weekDaysBetween = dateUtil.weekDaysBetween(dateTwo, dateOne);
    return Math.abs(totalDaysBetween - weekDaysBetween);
  },

  // Add a number of weekdays, `count`, to `date`
  addWeekDays(date, count) {
    if (count === 0 || isNaN(count)) {
      return dateUtil.cloneDate(date);
    }

    var sign = Math.sign(count);
    var day = date.getDay();
    var absIncrement = Math.abs(count);

    var days = 0;
    if (day === 0 && sign === -1) {
      days = 1;
    } else if (day === 6 && sign === 1) {
      days = 1;
    }

    // Add padding for weekends.
    var paddedAbsIncrement = absIncrement;
    if (day !== 0 && day !== 6 && sign > 0) {
      paddedAbsIncrement += day;
    } else if (day !== 0 && day !== 6 && sign < 0) {
      paddedAbsIncrement += 6 - day;
    }

    var weekendsInbetween =
      Math.max(Math.floor(paddedAbsIncrement / 5) - 1, 0) +
      (paddedAbsIncrement > 5 && paddedAbsIncrement % 5 > 0 ? 1 : 0);

    // Add the increment and number of weekends.
    days += absIncrement + weekendsInbetween * 2;

    return dateUtil.addDays(date, sign * days);
  },

  // Add `days` to `date`
  addDays(date, days) {
    date = dateUtil.cloneDate(date);
    date.setTime(date.getTime() + days * MILLISECONDS_PER_DAY);
    return date;
  },

  subtractDays(date, days) {
    return dateUtil.addDays(date, -days);
  },

  // Subtract `days` from `date`
  subtractWeekDays(date, days) {
    return dateUtil.addWeekDays(date, -days);
  },

  // Is `date` during a western work week?
  isWeekDay(date) {
    return !dateUtil.isWeekendDay(date);
  },

  // Is `date` a Saturday or Sunday?
  isWeekendDay(date) {
    return date.getDay() == 6 || date.getDay() == 0;
  },

  // Whether or not `dateOne` and `dateTwo` occur on the same day
  isSameDay(dateOne, dateTwo) {
    if (!dateOne || !dateTwo) { return false; }
    dateOne = `${dateOne.getYear()}-${dateOne.getDay()}`;
    dateTwo = `${dateTwo.getYear()}-${dateTwo.getDay()}`;
    return dateOne === dateTwo;
  },

  // Return a string representation of a date. The
  // supported styles are:
  // `iso`: 2015-10-11
  // `word`: Oct 11, 2015
  format(date, style) {
    var dd = date.getDate();
    var mm = date.getMonth();
    var y = date.getFullYear();
    return formatMethods[style](dd, mm, y);
  }
};

export default dateUtil;
