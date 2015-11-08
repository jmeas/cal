import dateUtil from '../../../src/common/date-util';

describe('dateUtil', () => {
  it('should be an Object', () => {
    expect(dateUtil).to.be.an('object');
  });

  it('it should have the correct API', () => {
    var props = [
      'millisecondsPerDay', 'create', 'cloneDate',
      'daysBetween', 'weekDaysBetween', 'weekendDaysBetween',
      'addWeekDays', 'subtractWeekDays', 'addDays', 'subtractDays',
      'isWeekDay', 'isWeekendDay', 'isSameDay', 'format'
    ];
    expect(dateUtil).to.have.keys(props);
  });

  describe('millisecondsPerDay', () => {
    it('should be a number', () => {
      expect(dateUtil.millisecondsPerDay).to.a('number');
    });
  });

  describe('create', () => {
    it('should create the correct date', () => {
      var newDate = dateUtil.create('2015-10-14');
      var manualCreated = new Date(2015, 9, 14);
      expect(dateUtil.isSameDay(newDate, manualCreated)).to.be.true;
    });
  });

  describe('cloneDate', () => {
    var date, clone;
    beforeEach(() => {
      date = dateUtil.create('2015-10-14');
      clone = dateUtil.cloneDate(date);
    });

    it('should return a new date that is the same day as the original', () => {
      var isSame = dateUtil.isSameDay(date, clone);
      expect(isSame).to.be.true;
      expect(date).to.not.equal(clone);
    });
  });

  describe('daysBetween', () => {
    var one, two;
    describe('same day', () => {
      it('should return 0', () => {
        one = new Date(2015, 2, 10);
        two = new Date(2015, 2, 10);
        expect(dateUtil.daysBetween(one, two)).to.equal(0);
      });
    });

    describe('one day after', () => {
      it('should return 1', () => {
        one = new Date(2015, 2, 10);
        two = new Date(2015, 2, 11);
        expect(dateUtil.daysBetween(one, two)).to.equal(1);
      });
    });

    describe('one day before', () => {
      it('should return -1', () => {
        one = new Date(2015, 2, 10);
        two = new Date(2015, 2, 9);
        expect(dateUtil.daysBetween(one, two)).to.equal(-1);
      });
    });

    describe('over DSL', () => {
      it('should work', () => {
        one = new Date(2015, 2, 10);
        two = new Date(2015, 2, 5);
        expect(dateUtil.daysBetween(one, two)).to.equal(-5);
      });
    });

    // Verified via WolframAlpha:
    // http://www.wolframalpha.com/input/?i=days+between+March+10%2C+2015+and+January+1+2350
    describe('over long time scales', () => {
      it('should work', () => {
        one = new Date(2015, 2, 10);
        two = new Date(2350, 0, 1);
        expect(dateUtil.daysBetween(one, two)).to.equal(122288);
      });
    });
  });

  describe('addDays', () => {
    it('should return the right result when adding 0 days', () => {
      var date = new Date(2015, 2, 10);
      var result = dateUtil.addDays(date, 0);
      expect(dateUtil.isSameDay(result, date)).to.be.true;
    });

    it('should return the right result when adding 1 day', () => {
      var date = new Date(2015, 2, 10);
      var result = dateUtil.addDays(date, 1);
      var expected = new Date(2015, 2, 11);
      expect(dateUtil.isSameDay(result, expected)).to.be.true;
    });

    it('should return the right result when adding 7 days', () => {
      var date = new Date(2015, 2, 10);
      var result = dateUtil.addDays(date, 7);
      var expected = new Date(2015, 2, 17);
      expect(dateUtil.isSameDay(result, expected)).to.be.true;
    });

    it('should work for negative numbers', () => {
      var date = new Date(2015, 2, 10);
      var result = dateUtil.addDays(date, -1);
      var expected = new Date(2015, 2, 9);
      expect(dateUtil.isSameDay(result, expected)).to.be.true;
    });

    it('should work across DSL transitions', () => {
      var date = new Date(2015, 2, 10);
      var result = dateUtil.addDays(date, -7);
      var expected = new Date(2015, 2, 3);
      expect(dateUtil.isSameDay(result, expected)).to.be.true;
    });

    // Verified with WolframAlpha:
    // http://www.wolframalpha.com/input/?i=March+10%2C+2015+plus+2000+days
    it('should work across month and year transitions', () => {
      var date = new Date(2015, 2, 10);
      var result = dateUtil.addDays(date, 2000);
      // August 30, 2020
      var expected = new Date(2020, 7, 30);
      expect(dateUtil.isSameDay(result, expected)).to.be.true;
    });
  });

  describe('subtractDays', () => {
    it('should delegate to `addDays` with a negative number of days', () => {
      stub(dateUtil, 'addDays');
      dateUtil.subtractDays(1, 2);
      expect(dateUtil.addDays).to.have.been.calledOnce;
      expect(dateUtil.addDays).to.have.been.calledWithExactly(1, -2);
    });
  });

  describe('isWeekDay', () => {
    it('should be true for Mon-Fri', () => {
      var mon = dateUtil.create('2015-01-12');
      var tue = dateUtil.create('2015-01-13');
      var wed = dateUtil.create('2015-01-14');
      var thu = dateUtil.create('2015-01-15');
      var fri = dateUtil.create('2015-01-16');
      expect(dateUtil.isWeekDay(mon)).to.be.true;
      expect(dateUtil.isWeekDay(tue)).to.be.true;
      expect(dateUtil.isWeekDay(wed)).to.be.true;
      expect(dateUtil.isWeekDay(thu)).to.be.true;
      expect(dateUtil.isWeekDay(fri)).to.be.true;
    });

    it('should be false for Saturday and Sunday', () => {
      var sat = dateUtil.create('2015-01-17');
      var sun = dateUtil.create('2015-01-18');
      expect(dateUtil.isWeekDay(sat)).to.be.false;
      expect(dateUtil.isWeekDay(sun)).to.be.false;
    });
  });

  describe('isWeekendDay', () => {
    it('should be false for Mon-Fri', () => {
      var mon = dateUtil.create('2015-01-12');
      var tue = dateUtil.create('2015-01-13');
      var wed = dateUtil.create('2015-01-14');
      var thu = dateUtil.create('2015-01-15');
      var fri = dateUtil.create('2015-01-16');
      expect(dateUtil.isWeekendDay(mon)).to.be.false;
      expect(dateUtil.isWeekendDay(tue)).to.be.false;
      expect(dateUtil.isWeekendDay(wed)).to.be.false;
      expect(dateUtil.isWeekendDay(thu)).to.be.false;
      expect(dateUtil.isWeekendDay(fri)).to.be.false;
    });

    it('should be true for Saturday and Sunday', () => {
      var sat = dateUtil.create('2015-01-17');
      var sun = dateUtil.create('2015-01-18');
      expect(dateUtil.isWeekendDay(sat)).to.be.true;
      expect(dateUtil.isWeekendDay(sun)).to.be.true;
    });
  });

  describe('isSameDay', () => {
    var dayOne, dayTwo;
    describe('two dates that are not the same day', () => {
      it('should return false', () => {
        dayOne = new Date(2015, 0, 10);
        dayTwo = new Date(2015, 0, 15);
        expect(dateUtil.isSameDay(dayOne, dayTwo)).to.be.false;
      });
    });

    describe('two dates that are the same day', () => {
      it('should return true', () => {
        dayOne = new Date(2015, 0, 10);
        dayTwo = new Date(2015, 0, 10);
        expect(dateUtil.isSameDay(dayOne, dayTwo)).to.be.true;
      });
    });

    describe('two dates that have different years', () => {
      it('should return false', () => {
        dayOne = new Date(2015, 0, 10);
        dayTwo = new Date(2016, 0, 10);
        expect(dateUtil.isSameDay(dayOne, dayTwo)).to.be.false;
      });
    });

    describe('two dates that are the same day, but have different minutes and seconds', () => {
      it('should return true', () => {
        dayOne = new Date(2015, 0, 10, 20, 5);
        dayTwo = new Date(2015, 0, 10, 0, 0);
        expect(dateUtil.isSameDay(dayOne, dayTwo)).to.be.true;
      });
    });
  });

  describe('format', () => {
    describe('iso', () => {
      it('should return the right format', () => {
        var date = new Date(2015, 0, 10);
        var result = dateUtil.format(date, 'iso');
        expect(result).to.equal('2015-1-10');
      });
    });

    describe('word', () => {
      it('should return the right format', () => {
        var date = new Date(2015, 0, 10);
        var result = dateUtil.format(date, 'word');
        expect(result).to.equal('Jan 10, 2015');
      });
    });
  });
});
