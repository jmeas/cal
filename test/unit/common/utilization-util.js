import utilizationUtil from '../../../src/common/utilization-util';

describe('utilizationUtil', () => {
  it('should be an Object', () => {
    expect(utilizationUtil).to.be.an('object');
  });

  it('should have exactly these methods', () => {
    var methodList = ['overlap', 'isAfter', 'isBefore'];
    expect(utilizationUtil).to.have.keys(methodList);
  });

  var one, two;
  describe('overlap', () => {
    //
    // 1
    //
    // 2
    //
    describe('two utilizations with a gap between them', () => {
      beforeEach(() => {
        one = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 1
        };

        two = {
          firstDayTimestamp: 3,
          lastDayTimestamp: 3
        };
      });

      it('should return false', () => {
        expect(utilizationUtil.overlap(one, two)).to.be.false;
      });
    });

    //
    // 1
    // 1
    // 2
    //
    describe('two utilizations without a gap between them', () => {
      beforeEach(() => {
        one = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 2
        };

        two = {
          firstDayTimestamp: 3,
          lastDayTimestamp: 3
        };
      });

      it('should return false', () => {
        expect(utilizationUtil.overlap(one, two)).to.be.false;
      });
    });

    //
    // 1 2
    // 1 2
    //
    describe('two cotemporal utilizations', () => {
      beforeEach(() => {
        one = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 2
        };

        two = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 2
        };
      });

      it('should return true', () => {
        expect(utilizationUtil.overlap(one, two)).to.be.true;
      });
    });

    //
    // 1 2
    // 1 2
    //   2
    //
    describe('two extends beyond one', () => {
      beforeEach(() => {
        one = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 2
        };

        two = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 3
        };
      });

      it('should return true', () => {
        expect(utilizationUtil.overlap(one, two)).to.be.true;
      });
    });

    //
    // 1 2
    // 1 2
    // 1
    //
    describe('one extends beyond two', () => {
      beforeEach(() => {
        one = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 3
        };

        two = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 2
        };
      });

      it('should return true', () => {
        expect(utilizationUtil.overlap(one, two)).to.be.true;
      });
    });

    //
    //   2
    // 1 2
    // 1 2
    //
    describe('two starts before one', () => {
      beforeEach(() => {
        one = {
          firstDayTimestamp: 2,
          lastDayTimestamp: 3
        };

        two = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 3
        };
      });

      it('should return true', () => {
        expect(utilizationUtil.overlap(one, two)).to.be.true;
      });
    });

    //
    // 1
    // 1 2
    // 1 2
    //
    describe('one starts before two', () => {
      beforeEach(() => {
        one = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 3
        };

        two = {
          firstDayTimestamp: 2,
          lastDayTimestamp: 3
        };
      });

      it('should return true', () => {
        expect(utilizationUtil.overlap(one, two)).to.be.true;
      });
    });

    //
    // 1
    // 1 2
    // 1 2
    //
    describe('partial overlap of one, start', () => {
      beforeEach(() => {
        one = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 3
        };

        two = {
          firstDayTimestamp: 2,
          lastDayTimestamp: 3
        };
      });

      it('should return true', () => {
        expect(utilizationUtil.overlap(one, two)).to.be.true;
      });
    });

    //
    // 1 2
    // 1 2
    // 1
    //
    describe('partial overlap of one, end', () => {
      beforeEach(() => {
        one = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 3
        };

        two = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 2
        };
      });

      it('should return true', () => {
        expect(utilizationUtil.overlap(one, two)).to.be.true;
      });
    });

    //
    // 1
    // 1 2
    // 1 2
    // 1
    //
    describe('partial overlap of one, both', () => {
      beforeEach(() => {
        one = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 4
        };

        two = {
          firstDayTimestamp: 2,
          lastDayTimestamp: 3
        };
      });

      it('should return true', () => {
        expect(utilizationUtil.overlap(one, two)).to.be.true;
      });
    });

    //
    //   2
    // 1 2
    // 1 2
    //
    describe('partial overlap of two, start', () => {
      beforeEach(() => {
        one = {
          firstDayTimestamp: 2,
          lastDayTimestamp: 3
        };

        two = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 3
        };
      });

      it('should return true', () => {
        expect(utilizationUtil.overlap(one, two)).to.be.true;
      });
    });

    //
    // 1 2
    // 1 2
    //   2
    //
    describe('partial overlap of two, end', () => {
      beforeEach(() => {
        one = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 2
        };

        two = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 3
        };
      });

      it('should return true', () => {
        expect(utilizationUtil.overlap(one, two)).to.be.true;
      });
    });

    //
    //   2
    // 1 2
    // 1 2
    //   2
    //
    describe('partial overlap of two, both', () => {
      beforeEach(() => {
        one = {
          firstDayTimestamp: 2,
          lastDayTimestamp: 3
        };

        two = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 4
        };
      });

      it('should return true', () => {
        expect(utilizationUtil.overlap(one, two)).to.be.true;
      });
    });
  });

  describe('isAfter', () => {
    //
    // 1 2
    // 1 2
    //
    describe('cotemporal utilizations', () => {
      beforeEach(() => {
        one = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 2
        };

        two = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 2
        };
      });

      it('should return false', () => {
        expect(utilizationUtil.isAfter(one, two)).to.be.false;
      });
    });

    //
    // 1
    // 1
    // 2
    //
    describe('two after one, no space', () => {
      beforeEach(() => {
        one = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 2
        };

        two = {
          firstDayTimestamp: 3,
          lastDayTimestamp: 3
        };
      });

      it('should return true', () => {
        expect(utilizationUtil.isAfter(one, two)).to.be.true;
      });
    });

    //
    // 2
    // 2
    // 1
    //
    describe('one after two, checking if two is after one, no space', () => {
      beforeEach(() => {
        one = {
          firstDayTimestamp: 3,
          lastDayTimestamp: 3
        };

        two = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 2
        };
      });

      it('should return false', () => {
        expect(utilizationUtil.isAfter(one, two)).to.be.false;
      });
    });

    //
    // 1
    // 1
    //
    // 2
    //
    describe('two after one, with a space', () => {
      beforeEach(() => {
        one = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 2
        };

        two = {
          firstDayTimestamp: 4,
          lastDayTimestamp: 4
        };
      });

      it('should return true', () => {
        expect(utilizationUtil.isAfter(one, two)).to.be.true;
      });
    });

    //
    // 1
    // 1 2
    //   2
    //
    describe('partial overlap', () => {
      beforeEach(() => {
        one = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 2
        };

        two = {
          firstDayTimestamp: 2,
          lastDayTimestamp: 3
        };
      });

      it('should return false', () => {
        expect(utilizationUtil.isAfter(one, two)).to.be.false;
      });
    });
  });

  describe('isBefore', () => {
    //
    // 1 2
    // 1 2
    //
    describe('cotemporal utilizations', () => {
      beforeEach(() => {
        one = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 2
        };

        two = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 2
        };
      });

      it('should return false', () => {
        expect(utilizationUtil.isBefore(one, two)).to.be.false;
      });
    });

    //
    // 1
    // 1
    // 2
    //
    describe('two after one, no space, testing if two is before one', () => {
      beforeEach(() => {
        one = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 2
        };

        two = {
          firstDayTimestamp: 3,
          lastDayTimestamp: 3
        };
      });

      it('should return true', () => {
        expect(utilizationUtil.isBefore(one, two)).to.be.false;
      });
    });

    //
    // 2
    // 2
    // 1
    //
    describe('one after two, checking if two is before one, no space', () => {
      beforeEach(() => {
        one = {
          firstDayTimestamp: 3,
          lastDayTimestamp: 3
        };

        two = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 2
        };
      });

      it('should return false', () => {
        expect(utilizationUtil.isBefore(one, two)).to.be.true;
      });
    });

    //
    // 2
    // 2
    //
    // 1
    //
    describe('one after two, with a space, testing if two is before one', () => {
      beforeEach(() => {
        one = {
          firstDayTimestamp: 4,
          lastDayTimestamp: 4
        };

        two = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 2
        };
      });

      it('should return true', () => {
        expect(utilizationUtil.isBefore(one, two)).to.be.true;
      });
    });

    //
    // 1
    // 1 2
    //   2
    //
    describe('partial overlap', () => {
      beforeEach(() => {
        one = {
          firstDayTimestamp: 1,
          lastDayTimestamp: 2
        };

        two = {
          firstDayTimestamp: 2,
          lastDayTimestamp: 3
        };
      });

      it('should return false', () => {
        expect(utilizationUtil.isBefore(one, two)).to.be.false;
      });
    });
  });
});
