import NodeListManager from '../../../src/axis-view/node-list-manager';

describe('NodeListManager', () => {
  it('should be a function', () => {
    expect(NodeListManager).to.be.a('function');
  });

  var nodeListManager, pool;
  beforeEach(() => {
    pool = {
      push: stub()
    };
  });

  describe('_clear', () => {
    beforeEach(() => {
      nodeListManager = new NodeListManager({
        el: document.createElement('div'),
        pool: pool
      });
    });

    describe('when there are no children elements', () => {
      it('should not push anything to the pool', () => {
        nodeListManager._clear();
        expect(pool.push).to.not.have.beenCalled;
      });
    });

    describe('when there are 3 children elements', () => {
      var elOne, elTwo, elThree;
      beforeEach(() => {
        elOne = document.createElement('div');
        elTwo = document.createElement('div');
        elThree = document.createElement('div');
        nodeListManager.el.appendChild(elOne);
        nodeListManager.el.appendChild(elTwo);
        nodeListManager.el.appendChild(elThree);
        nodeListManager._clear();
      });

      it('should call push three times', () => {
        expect(pool.push).to.have.been.calledThrice;
      });

      it('should have been called with each of the elements', () => {
        expect(pool.push).to.have.been.calledWithExactly(elOne);
        expect(pool.push).to.have.been.calledWithExactly(elTwo);
        expect(pool.push).to.have.been.calledWithExactly(elThree);
      });
    });
  });
});
