import dateUtil from '../../../src/common/date-util';

describe('dateUtil', () => {
  describe('it should be an Object', () => {
    expect(dateUtil).to.be.an('object');
  });

  describe('it should have the correct API', () => {
    var props = [
      'millisecondsPerDay', 'utc', 'create', 'cloneDate',
      'daysBetween', 'weekDaysBetween', 'weekendDaysBetween',
      'addWeekDays', 'addDays', 'subtractDays', 'subtractWeekDays',
      'isWeekDay', 'isWeekendDay', 'isSameDay', 'format'
    ];
    expect(dateUtil).to.have.keys(props);
  });
});
