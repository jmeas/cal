import _ from 'lodash';
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
        expect(pool.push).to.not.have.been.called;
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

      it('should remove all elements from the el', () => {
        expect(nodeListManager.el.children).to.have.length(0);
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
      });
    });

    describe('when there are no indices to begin with', () => {
      beforeEach(() => {
        nodeListManager.update({
          firstIndex: 10,
          lastIndex: 14
        });
      });

      it('should not call `_removeNodes`', () => {
        expect(nodeListManager._removeNodes).to.not.have.been.called;
      });

      it('should call `_addNodes`, passing the correct arguments', () => {
        expect(nodeListManager._addNodes).to.have.been.calledOnce;
        expect(nodeListManager._addNodes).to.have.been.calledWithExactly({
          referenceIndex: 10,
          direction: 1,
          clear: true,
          addDelta: 5
        });
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
          addDelta: 1,
          clear: false,
          referenceIndex: 16
        });
      });

      it('should call `_removeNodes` with the correct arguments', () => {
        expect(nodeListManager._removeNodes).to.have.been.calledOnce;
        expect(nodeListManager._removeNodes).to.have.been.calledWithExactly({
          direction: 1,
          removeDelta: 1
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
          addDelta: 1,
          clear: false,
          referenceIndex: 19
        });
      });

      it('should call `_removeNodes` with the correct arguments', () => {
        expect(nodeListManager._removeNodes).to.have.been.calledOnce;
        expect(nodeListManager._removeNodes).to.have.been.calledWithExactly({
          direction: 1,
          removeDelta: 1
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
          addDelta: 1,
          clear: false,
          referenceIndex: 0
        });
      });

      it('should call `_removeNodes` with the correct arguments', () => {
        expect(nodeListManager._removeNodes).have.been.calledOnce;
        expect(nodeListManager._removeNodes).to.have.been.calledWithExactly({
          direction: -1,
          removeDelta: 1
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
          addDelta: 5,
          clear: false,
          referenceIndex: 11
        });
      });

      it('should call `_removeNodes` with the correct arguments', () => {
        expect(nodeListManager._removeNodes).have.been.calledOnce;
        expect(nodeListManager._removeNodes).to.have.been.calledWithExactly({
          direction: 1,
          removeDelta: 5
        });
      });
    });

    describe('when the indices do not change at the same rate, positive', () => {
      describe('no change back, 1 change forward', () => {
        beforeEach(() => {
          nodeListManager._firstIndex = 5;
          nodeListManager._lastIndex = 10;

          nodeListManager.update({
            firstIndex: 5,
            lastIndex: 11,
            direction: 1
          });
        });

        it('should call `_addNodes` with the correct arguments', () => {
          expect(nodeListManager._addNodes).have.been.calledOnce;
          expect(nodeListManager._addNodes).to.have.been.calledWithExactly({
            direction: 1,
            addDelta: 1,
            clear: false,
            referenceIndex: 11
          });
        });

        it('should call `_removeNodes` with the correct arguments', () => {
          expect(nodeListManager._removeNodes).have.been.calledOnce;
          expect(nodeListManager._removeNodes).to.have.been.calledWithExactly({
            direction: 1,
            removeDelta: 0
          });
        });
      });

      describe('no change forward, 1 change forward at end', () => {
        beforeEach(() => {
          nodeListManager._firstIndex = 5;
          nodeListManager._lastIndex = 10;

          nodeListManager.update({
            firstIndex: 6,
            lastIndex: 10,
            direction: 1
          });
        });

        it('should call `_addNodes` with the correct arguments', () => {
          expect(nodeListManager._addNodes).have.been.calledOnce;
          expect(nodeListManager._addNodes).to.have.been.calledWithExactly({
            direction: 1,
            addDelta: 0,
            clear: false,
            referenceIndex: 11
          });
        });

        it('should call `_removeNodes` with the correct arguments', () => {
          expect(nodeListManager._removeNodes).have.been.calledOnce;
          expect(nodeListManager._removeNodes).to.have.been.calledWithExactly({
            direction: 1,
            removeDelta: 1
          });
        });
      });

      describe('5 changes at end, 0 change forward at start', () => {
        beforeEach(() => {
          nodeListManager._firstIndex = 5;
          nodeListManager._lastIndex = 10;

          nodeListManager.update({
            firstIndex: 5,
            lastIndex: 15,
            direction: 1
          });
        });

        it('should call `_addNodes` with the correct arguments', () => {
          expect(nodeListManager._addNodes).have.been.calledOnce;
          expect(nodeListManager._addNodes).to.have.been.calledWithExactly({
            direction: 1,
            addDelta: 5,
            clear: false,
            referenceIndex: 11
          });
        });

        it('should call `_removeNodes` with the correct arguments', () => {
          expect(nodeListManager._removeNodes).have.been.calledOnce;
          expect(nodeListManager._removeNodes).to.have.been.calledWithExactly({
            direction: 1,
            removeDelta: 0
          });
        });
      });
    });
  });

  describe('_removeNodes', () => {
    beforeEach(() => {
      nodeListManager = new NodeListManager({
        el: document.createElement('div'),
        pool: pool,
        displayProp: 'name',
        list: Array(20).fill({
          name: 'sandwich'
        })
      });
    });

    describe('when there are no children', () => {
      it('should not call pool.push', () => {
        nodeListManager._removeNodes({
          direction: 1,
          removeDelta: 10
        });

        expect(pool.push).to.not.have.been.called;
      });
    });

    describe('when there are children', () => {
      var elOne, elTwo, elThree;
      beforeEach(() => {
        elOne = document.createElement('div');
        elTwo = document.createElement('div');
        elThree = document.createElement('div');
        nodeListManager.el.appendChild(elOne);
        nodeListManager.el.appendChild(elTwo);
        nodeListManager.el.appendChild(elThree);
      });

      describe('and there is nothing to remove', () => {
        it('should not call pool.push', () => {
          nodeListManager._removeNodes({
            direction: 1,
            removeDelta: 0
          });

          expect(pool.push).to.not.have.been.called;
        });
      });

      describe('positive direction', () => {
        beforeEach(() => {
          nodeListManager._removeNodes({
            direction: 1,
            removeDelta: 2
          });
        });

        it('should remove the nodes, leaving the right ones', () => {
          expect(nodeListManager.el.children).to.have.length(1);
          expect(nodeListManager.el.children[0]).to.equal(elThree);
        });

        it('should push them into the pool', () => {
          expect(pool.push).to.have.been.calledTwice;
          expect(pool.push).to.have.been.calledWithExactly(elOne);
          expect(pool.push).to.have.been.calledWithExactly(elTwo);
        });
      });

      describe('negative direction', () => {
        beforeEach(() => {
          nodeListManager._removeNodes({
            direction: -1,
            removeDelta: 2
          });
        });

        it('should remove the nodes, leaving the right ones', () => {
          expect(nodeListManager.el.children).to.have.length(1);
          expect(nodeListManager.el.children[0]).to.equal(elOne);
        });

        it('should push them into the pool', () => {
          expect(pool.push).to.have.been.calledTwice;
          expect(pool.push).to.have.been.calledWithExactly(elTwo);
          expect(pool.push).to.have.been.calledWithExactly(elThree);
        });
      });
    });
  });

  describe('_addNodes', () => {
    beforeEach(() => {
      var list = _.map(Array(20), (v, i) => {
        return {
          name: i
        };
      });

      nodeListManager = new NodeListManager({
        el: document.createElement('div'),
        pool: pool,
        displayProp: 'name',
        list
      });
    });

    describe('when there is nothing to add', () => {
      it('should not add anything', () => {
        nodeListManager._addNodes({
          direction: 1,
          addDelta: 0,
          referenceIndex: 5,
          clear: false
        });

        expect(nodeListManager.el.children).to.have.length(0);
      });
    });

    describe('passing clear:true', () => {
      it('call clear', () => {
        stub(nodeListManager, '_clear');

        nodeListManager._addNodes({
          direction: 1,
          addDelta: 1,
          referenceIndex: 5,
          clear: true
        });

        expect(nodeListManager._clear).to.have.been.calledOnce;
      });
    });

    describe('forward', () => {
      describe('when in the middle of the list, adding 5', () => {
        beforeEach(() => {
          nodeListManager._addNodes({
            direction: 1,
            addDelta: 5,
            referenceIndex: 5,
            clear: false
          });
        });

        it('should add 5 new items', () => {
          expect(nodeListManager.el.children).to.have.length(5);
        });

        it('should render the correct items from the list', () => {
          expect(nodeListManager.el.children[0].textContent).to.equal('5');
          expect(nodeListManager.el.children[1].textContent).to.equal('6');
          expect(nodeListManager.el.children[2].textContent).to.equal('7');
          expect(nodeListManager.el.children[3].textContent).to.equal('8');
          expect(nodeListManager.el.children[4].textContent).to.equal('9');
        });
      });

      describe('when near the end of the list, adding 1', () => {
        beforeEach(() => {
          nodeListManager._addNodes({
            direction: 1,
            addDelta: 1,
            referenceIndex: 19,
            clear: false
          });
        });

        it('should add 1 new item', () => {
          expect(nodeListManager.el.children).to.have.length(1);
        });

        it('should render the correct items from the list', () => {
          expect(nodeListManager.el.children[0].textContent).to.equal('19');
        });
      });
    });

    describe('backward', () => {
      describe('when in the middle of the list, adding 5', () => {
        beforeEach(() => {
          nodeListManager._addNodes({
            direction: -1,
            addDelta: 5,
            referenceIndex: 9,
            clear: false
          });
        });

        it('should add 5 new items', () => {
          expect(nodeListManager.el.children).to.have.length(5);
        });

        it('should render the correct items from the list', () => {
          expect(nodeListManager.el.children[0].textContent).to.equal('5');
          expect(nodeListManager.el.children[1].textContent).to.equal('6');
          expect(nodeListManager.el.children[2].textContent).to.equal('7');
          expect(nodeListManager.el.children[3].textContent).to.equal('8');
          expect(nodeListManager.el.children[4].textContent).to.equal('9');
        });
      });

      describe('when near the beginning of the list, adding 1', () => {
        beforeEach(() => {
          nodeListManager._addNodes({
            direction: -1,
            addDelta: 1,
            referenceIndex: 0,
            clear: false
          });
        });

        it('should add 1 new item', () => {
          expect(nodeListManager.el.children).to.have.length(1);
        });

        it('should render the correct items from the list', () => {
          expect(nodeListManager.el.children[0].textContent).to.equal('0');
        });
      });
    });
  });

  describe('_createElementByIndex', () => {
    beforeEach(() => {
      var list = _.map(Array(20), (v, i) => {
        return {
          name: i
        };
      });

      nodeListManager = new NodeListManager({
        el: document.createElement('div'),
        pool: pool,
        displayProp: 'name',
        unit: 10,
        dim: 'left',
        list: list
      });
    });

    describe('the first index: 0', () => {
      var result;
      beforeEach(() => {
        result = nodeListManager._createElementByIndex(0);
      });

      it('should return an Element', () => {
        expect(result).to.be.instanceof(window.Element);
      });

      it('should have the proper text', () => {
        expect(result.textContent).to.equal('0');
      });

      it('should have the right style', () => {
        expect(result.style.left).to.equal('0px');
      });
    });

    describe('the last index: 19', () => {
      var result;
      beforeEach(() => {
        result = nodeListManager._createElementByIndex(19);
      });

      it('should return an Element', () => {
        expect(result).to.be.instanceof(window.Element);
      });

      it('should have the proper text', () => {
        expect(result.textContent).to.equal('19');
      });

      it('should have the right style', () => {
        expect(result.style.left).to.equal('190px');
      });
    });

    describe('an in-between index: 19', () => {
      var result;
      beforeEach(() => {
        result = nodeListManager._createElementByIndex(9);
      });

      it('should return an Element', () => {
        expect(result).to.be.instanceof(window.Element);
      });

      it('should have the proper text', () => {
        expect(result.textContent).to.equal('9');
      });

      it('should have the right style', () => {
        expect(result.style.left).to.equal('90px');
      });
    });
  });
});
