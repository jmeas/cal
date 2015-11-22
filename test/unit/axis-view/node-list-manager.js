import NodeListManager from '../../../src/axis-view/node-list-manager';

describe('NodeListManager', () => {
  it('should be a function', () => {
    expect(NodeListManager).to.be.a('function');
  });

  var nodeListManager, pool;
  beforeEach(() => {
    pool = {
      push: stub(),
      pop() {
        return document.createElement('div');
      }
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

  describe('_initialRender', () => {
    beforeEach(() => {
      nodeListManager = new NodeListManager({
        el: document.createElement('div'),
        pool: pool,
        displayProp: 'name',
        list: Array(20).fill({
          name: 'sandwich'
        })
      });

      stub(nodeListManager, '_clear');
    });

    describe('when there are no child elements', () => {
      it('should not call clear', () => {
        nodeListManager.initialRender({
          firstIndex: 0,
          lastIndex: 10
        });

        expect(nodeListManager._clear).to.not.have.beenCalled;
      });
    });

    describe('when there are child elements', () => {
      it('should call clear', () => {
        nodeListManager.el.appendChild(document.createElement('div'));

        nodeListManager.initialRender({
          firstIndex: 0,
          lastIndex: 10
        });

        expect(nodeListManager._clear).to.have.been.calledOnce;
      });
    });

    describe('when called to render 0 to 9', () => {
      beforeEach(() => {
        nodeListManager.initialRender({
          firstIndex: 0,
          lastIndex: 9
        });
      });

      it('should append 10 children', () => {
        expect(nodeListManager.el.children).to.have.length(10);
      });

      it('should update the internal indices', () => {
        expect(nodeListManager._firstIndex).to.equal(0);
        expect(nodeListManager._lastIndex).to.equal(9);
      });
    });
  });

  describe('_update', () => {
    beforeEach(() => {
      nodeListManager = new NodeListManager({
        el: document.createElement('div'),
        pool: pool,
        displayProp: 'name',
        list: Array(20).fill({
          name: 'sandwich'
        })
      });

      stub(nodeListManager, '_addNodes');
      stub(nodeListManager, '_removeNodes');
      stub(nodeListManager, 'initialRender');
    });

    describe('when the indices are unchanged', () => {
      it('should not call any methods', () => {
        nodeListManager._firstIndex = 10;
        nodeListManager._lastIndex = 15;

        nodeListManager.update({
          firstIndex: 10,
          lastIndex: 15
        });

        expect(nodeListManager._addNodes).to.not.have.been.called;
        expect(nodeListManager._removeNodes).to.not.have.been.called;
        expect(nodeListManager.initialRender).to.not.have.been.called;
      });
    });

    describe('when there are no indices to begin with', () => {
      it('should only call `initialRender`', () => {
        nodeListManager.update({
          firstIndex: 10,
          lastIndex: 15
        });

        expect(nodeListManager._addNodes).to.not.have.been.called;
        expect(nodeListManager._removeNodes).to.not.have.been.called;
        expect(nodeListManager.initialRender).to.have.been.calledOnce;
      });
    });

    describe('when the difference is a single node in the positive direction', () => {
      beforeEach(() => {
        nodeListManager._firstIndex = 10;
        nodeListManager._lastIndex = 15;

        nodeListManager.update({
          firstIndex: 11,
          lastIndex: 16,
          direction: 1
        });
      });

      it('should call `_addNodes` with the correct arguments', () => {
        expect(nodeListManager._addNodes).have.been.calledOnce;
        expect(nodeListManager._addNodes).to.have.been.calledWithExactly({
          direction: 1,
          addDelta: 1
        });
      });
    });

    describe('when the difference is adding the last element of the list', () => {
      beforeEach(() => {
        nodeListManager._firstIndex = 11;
        nodeListManager._lastIndex = 18;

        nodeListManager.update({
          firstIndex: 12,
          lastIndex: 19,
          direction: 1
        });
      });

      it('should call `_addNodes` with the correct arguments', () => {
        expect(nodeListManager._addNodes).have.been.calledOnce;
        expect(nodeListManager._addNodes).to.have.been.calledWithExactly({
          direction: 1,
          addDelta: 1
        });
      });
    });

    describe('when the difference is adding the first element of the list', () => {
      beforeEach(() => {
        nodeListManager._firstIndex = 1;
        nodeListManager._lastIndex = 10;

        nodeListManager.update({
          firstIndex: 0,
          lastIndex: 9,
          direction: -1
        });
      });

      it('should call `_addNodes` with the correct arguments', () => {
        expect(nodeListManager._addNodes).have.been.calledOnce;
        expect(nodeListManager._addNodes).to.have.been.calledWithExactly({
          direction: -1,
          addDelta: 1
        });
      });
    });

    describe('when the difference is adding a few nodes', () => {
      beforeEach(() => {
        nodeListManager._firstIndex = 5;
        nodeListManager._lastIndex = 10;

        nodeListManager.update({
          firstIndex: 10,
          lastIndex: 15,
          direction: 1
        });
      });

      it('should call `_addNodes` with the correct arguments', () => {
        expect(nodeListManager._addNodes).have.been.calledOnce;
        expect(nodeListManager._addNodes).to.have.been.calledWithExactly({
          direction: 1,
          addDelta: 5
        });
      });
    });
  });
});
