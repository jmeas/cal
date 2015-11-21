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
});
