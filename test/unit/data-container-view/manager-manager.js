import _ from 'lodash';
import ManagerManager from '../../../src/data-container-view/manager-manager';

describe('ManagerManager', () => {
  it('should be a function', () => {
    expect(ManagerManager).to.be.a('function');
  });

  var managerManager;
  describe('_clearAll', () => {
    beforeEach(() => {
      managerManager = new ManagerManager();
      managerManager._managers = _.map(Array(3), (v, i) => {
        return {
          clear: sinon.stub()
        };
      });

      managerManager._clearAll();
    });

    it('it should loop through each manager, calling clear on it', () => {
      expect(managerManager._managers[0].clear).to.have.been.calledOnce;
      expect(managerManager._managers[1].clear).to.have.been.calledOnce;
      expect(managerManager._managers[2].clear).to.have.been.calledOnce;
    });
  });

  describe('_broadcastDelete', () => {
    beforeEach(() => {
      managerManager = new ManagerManager();
      managerManager._managers = _.map(Array(6), (v, i) => {
        return {
          clear: sinon.stub()
        };
      });
    });

    describe('passing a length of 0', () => {
      it('should not call clear on any of the managers', () => {
        managerManager._broadcastDelete({
          direction: 1,
          removeDelta: 0,
          referenceIndex: 5
        });

        managerManager._managers.forEach(m => {
          expect(m.clear).to.not.have.been.called;
        });
      });
    });

    describe('forward', () => {
      describe('in the middle of the list', () => {
        beforeEach(() => {
          managerManager._broadcastDelete({
            direction: 1,
            removeDelta: 3,
            referenceIndex: 2
          });
        });

        it('should clear the correct managers', () => {
          expect(managerManager._managers[2].clear).to.have.been.calledOnce;
          expect(managerManager._managers[3].clear).to.have.been.calledOnce;
          expect(managerManager._managers[4].clear).to.have.been.calledOnce;
        });

        it('should not clear the other managers', () => {
          expect(managerManager._managers[0].clear).to.not.have.been.called;
          expect(managerManager._managers[1].clear).to.not.have.been.called;
          expect(managerManager._managers[5].clear).to.not.have.been.called;
        });
      });

      describe('at the end of the list', () => {
        beforeEach(() => {
          managerManager._broadcastDelete({
            direction: 1,
            removeDelta: 1,
            referenceIndex: 5
          });
        });

        it('should clear the correct managers', () => {
          expect(managerManager._managers[5].clear).to.have.been.calledOnce;
        });

        it('should not clear the other managers', () => {
          expect(managerManager._managers[0].clear).to.not.have.been.called;
          expect(managerManager._managers[1].clear).to.not.have.been.called;
          expect(managerManager._managers[2].clear).to.not.have.been.called;
          expect(managerManager._managers[3].clear).to.not.have.been.called;
          expect(managerManager._managers[4].clear).to.not.have.been.called;
        });
      });
    });

    describe('backward', () => {
      describe('in the middle of the list', () => {
        beforeEach(() => {
          managerManager._broadcastDelete({
            direction: -1,
            removeDelta: 2,
            referenceIndex: 3
          });
        });

        it('should clear the correct managers', () => {
          expect(managerManager._managers[3].clear).to.have.been.calledOnce;
          expect(managerManager._managers[2].clear).to.have.been.calledOnce;
        });

        it('should not clear the other managers', () => {
          expect(managerManager._managers[0].clear).to.not.have.been.called;
          expect(managerManager._managers[1].clear).to.not.have.been.called;
          expect(managerManager._managers[4].clear).to.not.have.been.called;
          expect(managerManager._managers[5].clear).to.not.have.been.called;
        });
      });

      describe('at the beginning of the list', () => {
        beforeEach(() => {
          managerManager._broadcastDelete({
            direction: -1,
            removeDelta: 1,
            referenceIndex: 0
          });
        });

        it('should clear the correct managers', () => {
          expect(managerManager._managers[0].clear).to.have.been.calledOnce;
        });

        it('should not clear the other managers', () => {
          expect(managerManager._managers[1].clear).to.not.have.been.called;
          expect(managerManager._managers[2].clear).to.not.have.been.called;
          expect(managerManager._managers[3].clear).to.not.have.been.called;
          expect(managerManager._managers[4].clear).to.not.have.been.called;
          expect(managerManager._managers[5].clear).to.not.have.been.called;
        });
      });
    });
  });

  describe('_broadcastUpdate', () => {
    beforeEach(() => {
      managerManager = new ManagerManager();
      managerManager._managers = _.map(Array(6), (v, i) => {
        return {
          render: stub()
        };
      });

      stub(managerManager, '_clearAll');
    });

    describe('passing clear:true', () => {
      it('should call `_clearAll`', () => {
        managerManager._broadcastUpdate({
          clear: true,
          firstXIndex: 1,
          lastXIndex: 1
        });

        expect(managerManager._clearAll).to.have.been.called;
      });
    });

    describe('in the middle of the list', () => {
      beforeEach(() => {
        managerManager._broadcastUpdate({
          firstXIndex: 3,
          lastXIndex: 4,
          firstYIndex: 0,
          lastYIndex: 1,
          yDirection: 1,
          clear: false
        });
      });

      it('should call `render` on the correct managers', () => {
        expect(managerManager._managers[3].render).to.have.been.calledOnce;
        expect(managerManager._managers[4].render).to.have.been.calledOnce;
      });

      it('should not call `render` on the other managers', () => {
        expect(managerManager._managers[0].render).to.not.have.been.called;
        expect(managerManager._managers[1].render).to.not.have.been.called;
        expect(managerManager._managers[2].render).to.not.have.been.called;
        expect(managerManager._managers[5].render).to.not.have.been.called;
      });
    });

    describe('at the end of the list', () => {
      beforeEach(() => {
        managerManager._broadcastUpdate({
          firstXIndex: 4,
          lastXIndex: 5,
          firstYIndex: 0,
          lastYIndex: 1,
          yDirection: 1,
          clear: false
        });
      });

      it('should call `render` on the correct managers', () => {
        expect(managerManager._managers[4].render).to.have.been.calledOnce;
        expect(managerManager._managers[5].render).to.have.been.calledOnce;
      });

      it('should not call `render` on the other managers', () => {
        expect(managerManager._managers[0].render).to.not.have.been.called;
        expect(managerManager._managers[1].render).to.not.have.been.called;
        expect(managerManager._managers[2].render).to.not.have.been.called;
        expect(managerManager._managers[3].render).to.not.have.been.called;
      });
    });
  });
});
