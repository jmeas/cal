import packingUtil from '../../../src/common/packing-util';

describe('quantize', () => {
  it('should be a function', () => {
    expect(packingUtil).to.be.a('function');
  });

  describe('two rectangles that do not overlap with space between them', () => {
    var one, two, result, rectangles;
    beforeEach(() => {
      one = {
        start: 1,
        end: 2
      };

      two = {
        start: 5,
        end: 10
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

  describe('two rectangles that do not overlap that are bordering one another', () => {
    var one, two, result, rectangles;
    beforeEach(() => {
      one = {
        start: 1,
        end: 2
      };

      two = {
        start: 3,
        end: 10
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

    it('should give both of them a columnSize of 1', () => {
      expect(result[0].columnSize).to.equal(1);
      expect(result[1].columnSize).to.equal(1);
    });
  });

  describe('two rectangles that are the same', () => {
    var one, two, result, rectangles;
    beforeEach(() => {
      one = {
        start: 1,
        end: 5
      };

      two = {
        start: 1,
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

    it('should give them both columnSize of 2', () => {
      expect(result[0].columnSize).to.equal(2);
      expect(result[1].columnSize).to.equal(2);
    });
  });

  describe('two rectangles, where the first "contains" the second', () => {
    var one, two, result, rectangles;
    beforeEach(() => {
      one = {
        start: 1,
        end: 15
      };

      two = {
        start: 5,
        end: 6
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

    it('should give them both columnSize of 2', () => {
      expect(result[0].columnSize).to.equal(2);
      expect(result[1].columnSize).to.equal(2);
    });
  });

  describe('two rectangles, where the second extends beyond the first', () => {
    var one, two, result, rectangles;
    beforeEach(() => {
      one = {
        start: 1,
        end: 15
      };

      two = {
        start: 5,
        end: 20
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

    it('should give them both columnSize of 2', () => {
      expect(result[0].columnSize).to.equal(2);
      expect(result[1].columnSize).to.equal(2);
    });
  });

  describe('three rectangles that can be packed tightly', () => {
    var one, two, three, result, rectangles;
    beforeEach(() => {
      one = {
        start: 1,
        end: 5
      };

      two = {
        start: 3,
        end: 7
      };

      three = {
        start: 6,
        end: 9
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

    it('should give them all columnSize of 2', () => {
      expect(result[0].columnSize).to.equal(2);
      expect(result[1].columnSize).to.equal(2);
      expect(result[2].columnSize).to.equal(2);
    });
  });

  describe('two overlaps, one loner', () => {
    var one, two, three, result, rectangles;
    beforeEach(() => {
      one = {
        start: 1,
        end: 5
      };

      two = {
        start: 6,
        end: 10
      };

      three = {
        start: 9,
        end: 11
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
  });
});
