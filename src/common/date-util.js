import _ from 'lodash';
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
  millisecondsPerDay: MILLISECONDS_PER_DAY,

  // Create a local date from a `dateString` format of "YYYY-MM-DD".
  // `new Date(dateString)` cannot be used because of its inconsistent nature
  // around timezones. In `cal`, the day value refers to a day, rather than
  // a specific datetime. If a date is created via `new Date` as UTC, then in certain
  // timezones the created date will have a different day than what was specified in the
  // string. For instance: '2015-01-14'. This is supposed to represent January 14th, 2015,
  // but on the east coast it will be created as `Tue Jan 13 2015 19:00:00 GMT-0500`.
  // Note that the behavior of `new Date(dateString)` isn't consistent across browsers,
  // but this method smooths out the inconsistencies and always works as expected.
  create(dateString) {
    var parts = dateString.split('-');
    // Convert them to integers
    parts = _.map(parts, p => parseInt(p, 10));
    // Months are 0 indexed
    parts[1]--;
    return new Date(...parts);
  },

  // Returns a clone of `date`
  cloneDate(date) {
    return new Date(date.getTime());
  },

  // The number of days between `dateOne` and `dateTwo`
  // We can't use milliseconds here because of daylight savings: some days
  // have fewer than 24 hours between them.
  daysBetween(dateOne, dateTwo) {
    function treatAsUTC(date) {
      var result = dateUtil.cloneDate(date);
      result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
      return result;
    }

    dateOne = treatAsUTC(dateOne);
    dateTwo = treatAsUTC(dateTwo);
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

  // Subtract `days` from `date`
  subtractWeekDays(date, days) {
    return dateUtil.addWeekDays(date, -days);
  },

  // Add `days` to `date`
  // We can't use milliseconds here because in timezones with daylight
  // savings some days don't have 24 hours in them.
  addDays(date, days) {
    date = dateUtil.cloneDate(date);
    date.setDate(date.getDate() + days);
    return date;
  },

  subtractDays(date, days) {
    return dateUtil.addDays(date, -days);
  },

  // Is `date` during a western work week?
  isWeekDay(date) {
    return !dateUtil.isWeekendDay(date);
  },

  // Is `date` a Saturday or Sunday?
  isWeekendDay(date) {
    return date.getDay() === 6 || date.getDay() === 0;
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
