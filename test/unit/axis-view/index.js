import AxisView from '../../../src/axis-view';

describe('AxisView', () => {
  it('should be a function', () => {
    expect(AxisView).to.be.a('function');
  });

  var axisView;
  describe('_getIndices', () => {
    beforeEach(() => {
      axisView = new AxisView({
        el: document.createElement('div'),
        padding: 3,
        list: new Array(20),
        _createManager: stub()
      });
    });

    describe('when calling from well within the ends of the list', () => {
      it('should return the correct indices', () => {
        var result = axisView._getIndices(10, 3);
        expect(result.firstIndex).to.equal(7);
        expect(result.lastIndex).to.equal(16);
      });
    });

    describe('when calling near the start', () => {
      it('should return the correct indices', () => {
        var result = axisView._getIndices(2, 3);
        expect(result.firstIndex).to.equal(0);
        expect(result.lastIndex).to.equal(8);
      });
    });

    describe('when calling at the start', () => {
      it('should return the correct indices', () => {
        var result = axisView._getIndices(0, 3);
        expect(result.firstIndex).to.equal(0);
        expect(result.lastIndex).to.equal(6);
      });
    });

    describe('when calling near the end', () => {
      it('should return the correct indices', () => {
        var result = axisView._getIndices(18, 3);
        expect(result.firstIndex).to.equal(15);
        expect(result.lastIndex).to.equal(19);
      });
    });

    describe('when calling at the end', () => {
      it('should return the correct indices', () => {
        var result = axisView._getIndices(19, 3);
        expect(result.firstIndex).to.equal(16);
        expect(result.lastIndex).to.equal(19);
      });
    });

    describe('with an offset of 0', () => {
      it('should return the correct indices', () => {
        var result = axisView._getIndices(15, 0);
        expect(result.firstIndex).to.equal(12);
        expect(result.lastIndex).to.equal(18);
      });
    });
  });
});
