import ListView from '../../../src/list-view';

describe('ListView', () => {
  it('should be a function', () => {
    expect(ListView).to.be.a('function');
  });

  var listView;
  describe('render', () => {
    var clock;
    beforeEach(() => {
      clock = useFakeTimers();
      listView = new ListView({
        el: document.createElement('div'),
        _createManager: stub()
      });
      stub(listView, '_update');
    });

    describe('when no speed is given', () => {
      it('should update immediately', () => {
        var options = {scrollOffset: 5};
        listView.render(options);

        expect(listView._update).to.have.been.calledOnce;
        expect(listView._update).to.have.been.calledWithExactly(options);
      });
    });

    describe('when a slow speed is given', () => {
      it('should update immediately', () => {
        var options = {
          scrollOffset: 5,
          speed: 2
        };
        listView.render(options);

        expect(listView._update).to.have.been.calledOnce;
        expect(listView._update).to.have.been.calledWithExactly(options);
      });
    });

    describe('when a fast speed is given', () => {
      var options;
      beforeEach(() => {
        options = {
          scrollOffset: 2,
          speed: 100
        };
        listView.render(options);
      });

      it('should not update immediately', () => {
        expect(listView._update).to.not.have.been.called;
      });

      it('should update after a few milliseconds', () => {
        clock.tick(50);
        expect(listView._update).to.have.been.calledOnce;
        expect(listView._update).to.have.been.calledWithExactly(options);
      });
    });

    describe('when a fast speed is given repeatedly, with time in-between', () => {
      it('should update after some time between the last call', () => {
        var options = {
          scrollOffset: 2,
          speed: 100
        };
        listView.render(options);
        clock.tick(20);
        listView.render(options);
        clock.tick(30);
        listView.render(options);
        clock.tick(30);
        listView.render(options);
        clock.tick(30);
        expect(listView._update).to.not.have.been.called;
        clock.tick(20);
        expect(listView._update).to.have.been.calledOnce;
        expect(listView._update).to.have.been.calledWithExactly(options);
      });
    });
  });

  describe('_computeIndices', () => {
    beforeEach(() => {
      listView = new ListView({
        el: document.createElement('div'),
        _createManager: stub()
      });
    });

    describe('when calling from well within the ends of the list', () => {
      it('should return the correct indices', () => {
        var result = listView._computeIndices({
          offset: 10,
          length: 3,
          min: 0,
          max: 19,
          padding: 3
        });
        expect(result.firstIndex).to.equal(7);
        expect(result.lastIndex).to.equal(16);
      });
    });

    describe('when calling near the start', () => {
      it('should return the correct indices', () => {
        var result = listView._computeIndices({
          offset: 2,
          length: 3,
          min: 0,
          max: 19,
          padding: 3
        });
        expect(result.firstIndex).to.equal(0);
        expect(result.lastIndex).to.equal(8);
      });
    });

    describe('when calling at the start', () => {
      it('should return the correct indices', () => {
        var result = listView._computeIndices({
          offset: 0,
          length: 3,
          min: 0,
          max: 19,
          padding: 3
        });
        expect(result.firstIndex).to.equal(0);
        expect(result.lastIndex).to.equal(6);
      });
    });

    describe('when calling near the end', () => {
      it('should return the correct indices', () => {
        var result = listView._computeIndices({
          offset: 18,
          length: 3,
          min: 0,
          max: 19,
          padding: 3
        });
        expect(result.firstIndex).to.equal(15);
        expect(result.lastIndex).to.equal(19);
      });
    });

    describe('when calling at the end', () => {
      it('should return the correct indices', () => {
        var result = listView._computeIndices({
          offset: 19,
          length: 3,
          min: 0,
          max: 19,
          padding: 3
        });
        expect(result.firstIndex).to.equal(16);
        expect(result.lastIndex).to.equal(19);
      });
    });

    describe('with an offset of 0', () => {
      it('should return the correct indices', () => {
        var result = listView._computeIndices({
          offset: 15,
          length: 0,
          min: 0,
          max: 19,
          padding: 3
        });
        expect(result.firstIndex).to.equal(12);
        expect(result.lastIndex).to.equal(18);
      });
    });
  });
});
