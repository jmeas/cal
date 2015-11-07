import packingUtil from '../../../src/common/packing-util';

describe('packingUtil', () => {
  it('should be a function', () => {
    expect(packingUtil).to.be.a('function');
  });

  //
  //  1
  //  1
  //
  //  2
  //  2
  //
  describe('two rectangles that do not overlap with space between them', () => {
    var one, two, result, rectangles;
    beforeEach(() => {
      one = {
        start: 1,
        end: 2
      };

      two = {
        start: 4,
        end: 5
      };

      rectangles = [one, two];

      result = packingUtil({
        rectangles,
        startProp: 'start',
        endProp: 'end'
      });
    });

    it('should return the original array, with the same length', () => {
      expect(result).to.have.length(2);
      expect(result).to.have.equal(rectangles);
    });

    it('should place them both in position 0', () => {
      expect(result[0].position).to.equal(0);
      expect(result[1].position).to.equal(0);
    });
  });

  //
  //  1
  //  1
  //  2
  //  2
  //
  describe('two rectangles that do not overlap that are bordering one another', () => {
    var one, two, result, rectangles;
    beforeEach(() => {
      one = {
        start: 1,
        end: 2
      };

      two = {
        start: 3,
        end: 4
      };

      rectangles = [one, two];

      result = packingUtil({
        rectangles,
        startProp: 'start',
        endProp: 'end'
      });
    });

    it('should return the original array, with the same length', () => {
      expect(result).to.have.length(2);
      expect(result).to.have.equal(rectangles);
    });

    it('should place them both in position 0', () => {
      expect(result[0].position).to.equal(0);
      expect(result[1].position).to.equal(0);
    });

    it('should give both of them a groupWidth of 1', () => {
      expect(result[0].groupWidth).to.equal(1);
      expect(result[1].groupWidth).to.equal(1);
    });
  });

  //
  //  1 2
  //  1 2
  //  1 2
  //  1 2
  //
  describe('two rectangles that are the same', () => {
    var one, two, result, rectangles;
    beforeEach(() => {
      one = {
        start: 1,
        end: 4
      };

      two = {
        start: 1,
        end: 4
      };

      rectangles = [one, two];

      result = packingUtil({
        rectangles,
        startProp: 'start',
        endProp: 'end'
      });
    });

    it('should return the original array, with the same length', () => {
      expect(result).to.have.length(2);
      expect(result).to.have.equal(rectangles);
    });

    it('should place the first in position 0', () => {
      expect(result[0].position).to.equal(0);
    });

    it('should place the second in position 1', () => {
      expect(result[1].position).to.equal(1);
    });

    it('should give them both groupWidth of 2', () => {
      expect(result[0].groupWidth).to.equal(2);
      expect(result[1].groupWidth).to.equal(2);
    });
  });

  //
  //  1
  //  1
  //  1 2
  //  1 2
  //  1
  //
  describe('two rectangles, where the first "contains" the second', () => {
    var one, two, result, rectangles;
    beforeEach(() => {
      one = {
        start: 1,
        end: 5
      };

      two = {
        start: 3,
        end: 4
      };

      rectangles = [one, two];

      result = packingUtil({
        rectangles,
        startProp: 'start',
        endProp: 'end'
      });
    });

    it('should return the original array, with the same length', () => {
      expect(result).to.have.length(2);
      expect(result).to.have.equal(rectangles);
    });

    it('should place the first in position 0', () => {
      expect(result[0].position).to.equal(0);
    });

    it('should place the second in position 1', () => {
      expect(result[1].position).to.equal(1);
    });

    it('should give them both groupWidth of 2', () => {
      expect(result[0].groupWidth).to.equal(2);
      expect(result[1].groupWidth).to.equal(2);
    });
  });

  //
  //  1
  //  1 2
  //  1 2
  //    2
  //    2
  //
  describe('two rectangles, where the second extends beyond the first', () => {
    var one, two, result, rectangles;
    beforeEach(() => {
      one = {
        start: 1,
        end: 3
      };

      two = {
        start: 2,
        end: 5
      };

      rectangles = [one, two];

      result = packingUtil({
        rectangles,
        startProp: 'start',
        endProp: 'end'
      });
    });

    it('should return the original array, with the same length', () => {
      expect(result).to.have.length(2);
      expect(result).to.have.equal(rectangles);
    });

    it('should place the first in position 0', () => {
      expect(result[0].position).to.equal(0);
    });

    it('should place the second in position 1', () => {
      expect(result[1].position).to.equal(1);
    });

    it('should give them both groupWidth of 2', () => {
      expect(result[0].groupWidth).to.equal(2);
      expect(result[1].groupWidth).to.equal(2);
    });
  });

  //
  //  1
  //  1 2
  //  1 2
  //  3 2
  //  3 2
  //  3
  //
  describe('three rectangles that can be packed tightly', () => {
    var one, two, three, result, rectangles;
    beforeEach(() => {
      one = {
        start: 1,
        end: 3
      };

      two = {
        start: 2,
        end: 5
      };

      three = {
        start: 4,
        end: 6
      };

      rectangles = [one, two, three];

      result = packingUtil({
        rectangles,
        startProp: 'start',
        endProp: 'end'
      });
    });

    it('should return the original array, with the same length', () => {
      expect(result).to.have.length(3);
      expect(result).to.have.equal(rectangles);
    });

    it('should place the first in position 0', () => {
      expect(result[0].position).to.equal(0);
    });

    it('should place the second in position 1', () => {
      expect(result[1].position).to.equal(1);
    });

    it('should place the third in position 0', () => {
      expect(result[2].position).to.equal(0);
    });

    it('should give them all groupWidth of 2', () => {
      expect(result[0].groupWidth).to.equal(2);
      expect(result[1].groupWidth).to.equal(2);
      expect(result[2].groupWidth).to.equal(2);
    });
  });

  //
  //  1
  //  1
  //
  //  2
  //  2 3
  //  2 3
  //    3
  //
  describe('two overlaps, one loner', () => {
    var one, two, three, result, rectangles;
    beforeEach(() => {
      one = {
        start: 1,
        end: 2
      };

      two = {
        start: 4,
        end: 6
      };

      three = {
        start: 5,
        end: 7
      };

      rectangles = [one, two, three];

      result = packingUtil({
        rectangles,
        startProp: 'start',
        endProp: 'end'
      });
    });

    it('should return the original array, with the same length', () => {
      expect(result).to.have.length(3);
      expect(result).to.have.equal(rectangles);
    });

    it('should place the first in position 0', () => {
      expect(result[0].position).to.equal(0);
    });

    it('should place the second in position 0', () => {
      expect(result[1].position).to.equal(0);
    });

    it('should place the third in position 1', () => {
      expect(result[2].position).to.equal(1);
    });

    it('should place the first length of 1', () => {
      expect(result[0].groupWidth).to.equal(1);
    });

    it('should place the second to be of length 2', () => {
      expect(result[1].groupWidth).to.equal(2);
    });

    it('should place the third to be of length 2', () => {
      expect(result[2].groupWidth).to.equal(2);
    });
  });

  //
  //  1 2 3 4 5
  //  1 2 3 4 5
  //  1 2 3 4 5
  //  1 2 3 4 5
  //  1 2 3 4 5
  //
  describe('four overlaps', () => {
    var one, two, three, four, rectangles, result;
    beforeEach(() => {
      one = {
        start: 1,
        end: 5
      };

      two = {
        start: 1,
        end: 5
      };

      three = {
        start: 1,
        end: 5
      };

      four = {
        start: 1,
        end: 5
      };

      rectangles = [one, two, three, four];

      result = packingUtil({
        rectangles,
        startProp: 'start',
        endProp: 'end'
      });
    });

    it('should return the original array, with the same length', () => {
      expect(result).to.have.length(4);
      expect(result).to.have.equal(rectangles);
    });

    it('should place them all next to one another', () => {
      expect(result[0].position).to.equal(0);
      expect(result[1].position).to.equal(1);
      expect(result[2].position).to.equal(2);
      expect(result[3].position).to.equal(3);
    });

    it('should give them all length of 4', () => {
      expect(result[0].groupWidth).to.equal(4);
      expect(result[1].groupWidth).to.equal(4);
      expect(result[2].groupWidth).to.equal(4);
      expect(result[3].groupWidth).to.equal(4);
    });
  });

  //
  //  1
  //  1 2 3
  //  1 2
  //  1 4
  //  1
  //
  describe('a complex system', () => {
    var one, two, three, four, five, rectangles, result;
    beforeEach(() => {
      one = {
        start: 1,
        end: 5
      };

      two = {
        start: 2,
        end: 3
      };

      three = {
        start: 2,
        end: 2
      };

      four = {
        start: 4,
        end: 4
      };

      rectangles = [one, two, three, four];

      result = packingUtil({
        rectangles,
        startProp: 'start',
        endProp: 'end'
      });
    });

    it('should return the original array, with the same length', () => {
      expect(result).to.have.length(4);
      expect(result).to.have.equal(rectangles);
    });

    it('should get the positions correct', () => {
      expect(result[0].position).to.equal(0);
      expect(result[1].position).to.equal(1);
      expect(result[2].position).to.equal(2);
      expect(result[3].position).to.equal(1);
    });

    it('should get the groupWidths correct', () => {
      expect(result[0].groupWidth).to.equal(3);
      expect(result[1].groupWidth).to.equal(3);
      expect(result[2].groupWidth).to.equal(3);
      expect(result[3].groupWidth).to.equal(3);
    });
  });

  //
  //  1
  //  1
  //  1 2
  //    2
  //  3 2
  //  3 4
  //  3 4 5
  //      5
  //  6   5
  //
  describe('another complex system', () => {
    var one, two, three, four, five, six, rectangles, result;
    beforeEach(() => {
      one = {
        start: 1,
        end: 3
      };

      two = {
        start: 3,
        end: 5
      };

      three = {
        start: 5,
        end: 7
      };

      four = {
        start: 6,
        end: 7
      };

      five = {
        start: 7,
        end: 9
      };

      six = {
        start: 9,
        end: 9
      };

      rectangles = [one, two, three, four, five, six];

      result = packingUtil({
        rectangles,
        startProp: 'start',
        endProp: 'end'
      });
    });

    it('should return the original array, with the same length', () => {
      expect(result).to.have.length(6);
      expect(result).to.have.equal(rectangles);
    });

    it('should get the positions correct', () => {
      expect(result[0].position).to.equal(0);
      expect(result[1].position).to.equal(1);
      expect(result[2].position).to.equal(0);
      expect(result[3].position).to.equal(1);
      expect(result[4].position).to.equal(2);
      expect(result[5].position).to.equal(0);
    });

    it('should get the groupWidths correct', () => {
      expect(result[0].groupWidth).to.equal(3);
      expect(result[1].groupWidth).to.equal(3);
      expect(result[2].groupWidth).to.equal(3);
      expect(result[3].groupWidth).to.equal(3);
      expect(result[4].groupWidth).to.equal(3);
      expect(result[5].groupWidth).to.equal(3);
    });
  });
});
