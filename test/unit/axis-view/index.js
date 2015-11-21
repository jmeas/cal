import AxisView from '../../../src/axis-view';

describe('AxisView', () => {
  it('should be a function', () => {
    expect(AxisView).to.be.a('function');
  });

  var axisView;
  describe('render', () => {
    var clock;
    beforeEach(() => {
      clock = useFakeTimers();
      axisView = new AxisView({
        el: document.createElement('div')
      });
      stub(axisView, '_update');
    });

    describe('when no speed is given', () => {
      it('should update immediately', () => {
        var options = {scrollOffset: 5};
        axisView.render(options);

        expect(axisView._update).to.have.been.calledOnce;
        expect(axisView._update).to.have.been.calledWithExactly(options);
      });
    });

    describe('when a slow speed is given', () => {
      it('should update immediately', () => {
        var options = {
          scrollOffset: 5,
          speed: 2
        };
        axisView.render(options);

        expect(axisView._update).to.have.been.calledOnce;
        expect(axisView._update).to.have.been.calledWithExactly(options);
      });
    });

    describe('when a fast speed is given', () => {
      var options;
      beforeEach(() => {
        options = {
          scrollOffset: 2,
          speed: 100
        };
        axisView.render(options);
      });

      it('should not update immediately', () => {
        expect(axisView._update).to.not.have.been.called;
      });

      it('should update after a few milliseconds', () => {
        clock.tick(50);
        expect(axisView._update).to.have.been.calledOnce;
        expect(axisView._update).to.have.been.calledWithExactly(options);
      });
    });

    describe('when a fast speed is given repeatedly, with time in-between', () => {
      it('should update after some time between the last call', () => {
        var options = {
          scrollOffset: 2,
          speed: 100
        };
        axisView.render(options);
        clock.tick(20);
        axisView.render(options);
        clock.tick(30);
        axisView.render(options);
        clock.tick(30);
        axisView.render(options);
        clock.tick(30);
        expect(axisView._update).to.not.have.been.called;
        clock.tick(20);
        expect(axisView._update).to.have.been.calledOnce;
        expect(axisView._update).to.have.been.calledWithExactly(options);
      });
    });
  });

  describe('_getIndices', () => {
    beforeEach(() => {
      axisView = new AxisView({
        el: document.createElement('div'),
        padding: 3,
        list: new Array(20)
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

  describe('_update', () => {
    var nodeListManager, list;
    // The initial index will be: 8
    beforeEach(() => {
      list = new Array(20);
      axisView = new AxisView({
        el: document.createElement('div'),
        padding: 3,
        initialIndex: 10,
        list
      });

      nodeListManager = {
        update: sinon.stub()
      };

      axisView.nodeListManager = nodeListManager;
    });

    // Only test for initialIndex less than the list length
    describe('when passing no scrollOffset & the initialIndex is within bounds', () => {
      it('should use the default value', () => {
        axisView._update({length: 6});
        expect(nodeListManager.update).to.have.been.calledOnce;
        expect(nodeListManager.update).to.have.been.calledWithExactly({
          list,
          firstIndex: 7,
          lastIndex: 19
        });
      });
    });

    describe('when passing a scrollOffset of 0', () => {
      it('should call `nodeListManager.update` with the correct arguments', () => {
        axisView._update({
          offset: 0,
          length: 6
        });
        expect(nodeListManager.update).to.have.been.calledOnce;
        expect(nodeListManager.update).to.have.been.calledWithExactly({
          list,
          firstIndex: 0,
          lastIndex: 9
        });
      });
    });

    describe('when passing a scrollOffset of 41', () => {
      it('should call `nodeListManager.update` with the correct arguments', () => {
        axisView._update({
          offset: 1,
          length: 6
        });
        expect(nodeListManager.update).to.have.been.calledOnce;
        expect(nodeListManager.update).to.have.been.calledWithExactly({
          list,
          firstIndex: 0,
          lastIndex: 10
        });
      });
    });

    describe('when passing a scrollOffset of 180', () => {
      it('should call `nodeListManager.update` with the correct arguments', () => {
        axisView._update({
          offset: 4,
          length: 6
        });
        expect(nodeListManager.update).to.have.been.calledOnce;
        expect(nodeListManager.update).to.have.been.calledWithExactly({
          list,
          firstIndex: 1,
          lastIndex: 13
        });
      });
    });

    describe('when passing a scrollOffset of 700', () => {
      it('should call `nodeListManager.update` with the correct arguments', () => {
        axisView._update({
          offset: 17,
          length: 6
        });
        expect(nodeListManager.update).to.have.been.calledOnce;
        expect(nodeListManager.update).to.have.been.calledWithExactly({
          list,
          firstIndex: 14,
          lastIndex: 19
        });
      });
    });
  });
});
