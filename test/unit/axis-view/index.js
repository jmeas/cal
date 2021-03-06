import AxisView from '../../../src/axis-view';

describe('AxisView', () => {
  it('should be a function', () => {
    expect(AxisView).to.be.a('function');
  });

  var axisView;
  describe('_computeManagerOptions', () => {
    var nodeListManager, list;
    // The initial index will be: 8
    beforeEach(() => {
      list = new Array(20);
      axisView = new AxisView({
        el: document.createElement('div'),
        padding: 3,
        initialIndex: 10,
        list,
        _createManager: sinon.stub()
      });
    });

    // Only test for initialIndex less than the list length
    describe('when passing no scrollOffset & the initialIndex is within bounds', () => {
      it('should use the default value', () => {
        var result = axisView._computeManagerOptions({length: 6});
        expect(result).to.deep.equal({
          firstIndex: 7,
          lastIndex: 18,
          direction: undefined
        });
      });
    });

    describe('when passing a scrollOffset of 0', () => {
      it('should compute the correct options', () => {
        var result = axisView._computeManagerOptions({
          offset: 0,
          length: 6,
          direction: 1
        });
        expect(result).to.deep.equal({
          firstIndex: 0,
          lastIndex: 8,
          direction: 1
        });
      });
    });

    describe('when passing an offset of 1', () => {
      it('should compute the correct options', () => {
        var result = axisView._computeManagerOptions({
          offset: 1,
          length: 6,
          direction: -1
        });
        expect(result).to.deep.equal({
          firstIndex: 0,
          lastIndex: 9,
          direction: -1
        });
      });
    });

    describe('when passing an ofset of 4', () => {
      it('should compute the correct options', () => {
        var result = axisView._computeManagerOptions({
          offset: 4,
          length: 6,
          direction: 1
        });
        expect(result).to.deep.equal({
          firstIndex: 1,
          lastIndex: 12,
          direction: 1
        });
      });
    });

    describe('when passing an offset of 17', () => {
      it('should compute the correct options', () => {
        var result = axisView._computeManagerOptions({
          offset: 17,
          length: 6,
          direction: -1
        });
        expect(result).to.deep.equal({
          firstIndex: 14,
          lastIndex: 19,
          direction: -1
        });
      });
    });
  });
});
