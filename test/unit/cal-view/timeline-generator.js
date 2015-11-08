import timelineGenerator from '../../../src/cal-view/timeline-generator';
import dateUtil from '../../../src/common/date-util';

describe('timelineGenerator', () => {
  it('should be a function', () => {
    expect(timelineGenerator).to.be.a('function');
  });

  var result, day;
  describe('days:', () => {
    describe('passing in 0 days forward, 0 days backward', () => {
      beforeEach(() => {
        day = new Date(2015, 0, 14);
        result = timelineGenerator({
          referenceDate: day,
          back: 0,
          forward: 0,
          scale: 'days'
        });
      });

      it('should return an array of length 1', () => {
        expect(result).to.be.an('array');
        expect(result).to.have.length(1);
      });

      it('should return an object with a time property', () => {
        expect(result[0]).to.have.keys('time');
      });

      it('should have be the same day as what was passed in', () => {
        var same = dateUtil.isSameDay(result[0].time, day);
        expect(same).to.be.true;
      });
    });

    describe('within the same week, passing in 2 days forward, 2 days backward', () => {
      beforeEach(() => {
        day = new Date(2015, 0, 14);
        result = timelineGenerator({
          referenceDate: day,
          back: 2,
          forward: 2,
          scale: 'days'
        });
      });

      it('should return an array of length 5', () => {
        expect(result).to.be.an('array');
        expect(result).to.have.length(5);
      });

      it('the 3rd item should be the same as what was passed in', () => {
        var same = dateUtil.isSameDay(result[2].time, day);
        expect(same).to.be.true;
      });

      it('the 1st item should be January 12th, 2015', () => {
        var same = dateUtil.isSameDay(result[0].time, new Date(2015, 0, 12));
        expect(same).to.be.true;
      });

      it('the 5th item should be January 16th, 2015', () => {
        var same = dateUtil.isSameDay(result[4].time, new Date(2015, 0, 16));
        expect(same).to.be.true;
      });
    });

    describe('crossing a weekend, passing in 5 days forward, 5 days backward', () => {
      beforeEach(() => {
        day = new Date(2015, 0, 14);
        result = timelineGenerator({
          referenceDate: day,
          back: 5,
          forward: 5,
          scale: 'days'
        });
      });

      it('should return an array of length 11', () => {
        expect(result).to.be.an('array');
        expect(result).to.have.length(11);
      });

      it('the 6th item should be the same as what was passed in', () => {
        var same = dateUtil.isSameDay(result[5].time, day);
        expect(same).to.be.true;
      });

      it('the first item should be January 7th, 2015', () => {
        var same = dateUtil.isSameDay(result[0].time, new Date(2015, 0, 7));
        expect(same).to.be.true;
      });

      it('the last item should be January 21st, 2015', () => {
        var same = dateUtil.isSameDay(result[10].time, new Date(2015, 0, 21));
        expect(same).to.be.true;
      });
    });
  });

  describe('weeks:', () => {
    describe('passing in 0 weeks forward, 0 weeks backward', () => {
      beforeEach(() => {
        day = new Date(2015, 0, 14);
        result = timelineGenerator({
          referenceDate: day,
          back: 0,
          forward: 0,
          scale: 'weeks'
        });
      });

      it('should return an array of length 1', () => {
        expect(result).to.be.an('array');
        expect(result).to.have.length(1);
      });

      it('should return an object with a time property', () => {
        expect(result[0]).to.have.keys('time');
      });

      it('should have be the same day as what was passed in', () => {
        var same = dateUtil.isSameDay(result[0].time, day);
        expect(same).to.be.true;
      });
    });

    describe('passing in 1 week forward, 1 week backward', () => {
      beforeEach(() => {
        day = new Date(2015, 0, 14);
        result = timelineGenerator({
          referenceDate: day,
          back: 1,
          forward: 1,
          scale: 'weeks'
        });
      });

      it('should return an array of length 3', () => {
        expect(result).to.be.an('array');
        expect(result).to.have.length(3);
      });

      it('should have the middle item as the original day', () => {
        var same = dateUtil.isSameDay(result[1].time, day);
        expect(same).to.be.true;
      });

      it('should have the first item be a week earlier', () => {
        var same = dateUtil.isSameDay(result[0].time, new Date(2015, 0, 7));
        expect(same).to.be.true;
      });

      it('should have the last item be a week earlier', () => {
        var same = dateUtil.isSameDay(result[0].time, new Date(2015, 0, 21));
        expect(same).to.be.true;
      });
    });
  });
});
