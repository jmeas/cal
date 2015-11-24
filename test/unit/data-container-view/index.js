import DataContainerView from '../../../src/data-container-view';

describe('DataContainerView', () => {
  it('should be a function', () => {
    expect(DataContainerView).to.be.a('function');
  });

  var dataContainerView;
  describe('_computeManagerOptions', () => {
    // The initial index will be: 8
    beforeEach(() => {
      dataContainerView = new DataContainerView({
        el: document.createElement('div'),
        padding: 3,
        employees: new Array(50),
        timeline: new Array(50),
        initialIndex: 10,
        _createManager: sinon.stub(),
        initialXIndex: 20,
        initialYIndex: 25
      });
    });

    // Only test for initialIndex less than the list length
    describe('when passing no scrollOffset & the initialIndex is within bounds', () => {
      it('should use the default value', () => {
        var result = dataContainerView._computeManagerOptions({
          width: 10,
          height: 5
        });

        expect(result).to.deep.equal({
          firstXIndex: 17,
          lastXIndex: 32,
          firstYIndex: 15,
          lastYIndex: 39,
          xDirection: undefined,
          yDirection: undefined
        });
      });
    });

    describe('when passing a left of 0', () => {
      it('should compute the correct options', () => {
        var result = dataContainerView._computeManagerOptions({
          width: 10,
          left: 0,
          height: 5,
          top: 25,
          xDirection: 1,
          yDirection: -1
        });

        expect(result).to.deep.equal({
          firstXIndex: 0,
          lastXIndex: 12,
          firstYIndex: 15,
          lastYIndex: 39,
          xDirection: 1,
          yDirection: -1
        });
      });
    });

    describe('when passing a top of 0', () => {
      it('should compute the correct options', () => {
        var result = dataContainerView._computeManagerOptions({
          width: 10,
          left: 10,
          height: 5,
          top: 0,
          xDirection: -1,
          yDirection: 1
        });

        expect(result).to.deep.equal({
          firstXIndex: 7,
          lastXIndex: 22,
          firstYIndex: 0,
          lastYIndex: 14,
          xDirection: -1,
          yDirection: 1
        });
      });
    });

    describe('when passing a left of 1', () => {
      it('should compute the correct options', () => {
        var result = dataContainerView._computeManagerOptions({
          width: 10,
          left: 1,
          height: 5,
          top: 25,
          xDirection: 1,
          yDirection: -1
        });

        expect(result).to.deep.equal({
          firstXIndex: 0,
          lastXIndex: 13,
          firstYIndex: 15,
          lastYIndex: 39,
          xDirection: 1,
          yDirection: -1
        });
      });
    });

    describe('when passing a top of 1', () => {
      it('should compute the correct options', () => {
        var result = dataContainerView._computeManagerOptions({
          width: 10,
          left: 10,
          height: 5,
          top: 1,
          xDirection: -1,
          yDirection: 1
        });

        expect(result).to.deep.equal({
          firstXIndex: 7,
          lastXIndex: 22,
          firstYIndex: 0,
          lastYIndex: 15,
          xDirection: -1,
          yDirection: 1
        });
      });
    });

    describe('when passing a left of 39', () => {
      it('should compute the correct options', () => {
        var result = dataContainerView._computeManagerOptions({
          width: 10,
          left: 39,
          height: 5,
          top: 25,
          xDirection: 1,
          yDirection: -1
        });

        expect(result).to.deep.equal({
          firstXIndex: 36,
          lastXIndex: 49,
          firstYIndex: 15,
          lastYIndex: 39,
          xDirection: 1,
          yDirection: -1
        });
      });
    });

    describe('when passing a top of 35', () => {
      it('should compute the correct options', () => {
        var result = dataContainerView._computeManagerOptions({
          width: 10,
          left: 10,
          height: 5,
          top: 35,
          xDirection: -1,
          yDirection: 1
        });

        expect(result).to.deep.equal({
          firstXIndex: 7,
          lastXIndex: 22,
          firstYIndex: 25,
          lastYIndex: 49,
          xDirection: -1,
          yDirection: 1
        });
      });
    });
  });
});
