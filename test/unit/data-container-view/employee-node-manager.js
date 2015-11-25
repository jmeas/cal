import _ from 'lodash';
import EmployeeNodeManager from '../../../src/data-container-view/employee-node-manager';

describe('EmployeeNodeManager', () => {
  it('should be a function', () => {
    expect(EmployeeNodeManager).to.be.a('function');
  });

  var employeeNodeManager;
  describe('clear', () => {
    var one, two;
    beforeEach(() => {
      one = {
        el: {
          remove: sinon.stub()
        }
      };
      two = {
        el: {
          remove: sinon.stub()
        }
      };
      employeeNodeManager = new EmployeeNodeManager();
      employeeNodeManager._children = [one, two];
      employeeNodeManager.clear();
    });

    it('should empty the children array', () => {
      expect(employeeNodeManager._children).to.have.length(0);
    });

    it('should remove the elements on each children', () => {
      expect(one.el.remove).to.have.been.calledOnce;
      expect(two.el.remove).to.have.been.calledOnce;
    });
  });
});
