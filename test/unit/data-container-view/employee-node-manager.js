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

  describe('_mapIndices', () => {
    beforeEach(() => {
      employeeNodeManager = new EmployeeNodeManager();
      employeeNodeManager.employee = {};
    });

    describe('when there are no employees', () => {
      it('should return 0', () => {
        employeeNodeManager.employee.utilizations = [];
        var result = employeeNodeManager._mapIndices({
          firstIndex: 3,
          lastIndex: 6
        });
        expect(result).to.deep.equal({
          firstIndex: 0,
          lastIndex: 0
        });
      });
    });

    describe('when there is 1 employee', () => {
      describe('and it is the same interval', () => {
        it('should return an interval containing that index', () => {
          employeeNodeManager.employee.utilizations = [
            {topIndex: 4, bottomIndex: 5}
          ];
          var result = employeeNodeManager._mapIndices({
            firstIndex: 4,
            lastIndex: 5
          });
          expect(result).to.deep.equal({
            firstIndex: 0,
            lastIndex: 1
          });
        });
      });

      describe('and it overlaps', () => {
        it('should return an interval containing that index', () => {
          employeeNodeManager.employee.utilizations = [
            {topIndex: 4, bottomIndex: 5}
          ];
          var result = employeeNodeManager._mapIndices({
            firstIndex: 3,
            lastIndex: 6
          });
          expect(result).to.deep.equal({
            firstIndex: 0,
            lastIndex: 1
          });
        });
      });

      describe('and it matches the top', () => {
        it('should return an interval containing that index', () => {
          employeeNodeManager.employee.utilizations = [
            {topIndex: 4, bottomIndex: 5}
          ];
          var result = employeeNodeManager._mapIndices({
            firstIndex: 1,
            lastIndex: 4
          });
          expect(result).to.deep.equal({
            firstIndex: 0,
            lastIndex: 1
          });
        });
      });

      describe('and it matches the bottom', () => {
        it('should return an interval containing that index', () => {
          employeeNodeManager.employee.utilizations = [
            {topIndex: 4, bottomIndex: 5}
          ];
          var result = employeeNodeManager._mapIndices({
            firstIndex: 5,
            lastIndex: 10
          });
          expect(result).to.deep.equal({
            firstIndex: 0,
            lastIndex: 1
          });
        });
      });

      describe('and it is before', () => {
        it('should return an interval not containing that index', () => {
          employeeNodeManager.employee.utilizations = [
            {topIndex: 4, bottomIndex: 5}
          ];
          var result = employeeNodeManager._mapIndices({
            firstIndex: 1,
            lastIndex: 2
          });
          expect(result).to.deep.equal({
            firstIndex: 0,
            lastIndex: 0
          });
        });
      });

      describe('and it is after', () => {
        it('should return an interval not containing that index', () => {
          employeeNodeManager.employee.utilizations = [
            {topIndex: 4, bottomIndex: 5}
          ];
          var result = employeeNodeManager._mapIndices({
            firstIndex: 7,
            lastIndex: 10
          });
          expect(result).to.deep.equal({
            firstIndex: 1,
            lastIndex: 1
          });
        });
      });
    });

    describe('when there are 2 employees, in different areas', () => {
      describe('and it overlaps with the first', () => {
        it('should return an interval containing that index', () => {
          employeeNodeManager.employee.utilizations = [
            {topIndex: 4, bottomIndex: 6},
            {topIndex: 10, bottomIndex: 12}
          ];
          var result = employeeNodeManager._mapIndices({
            firstIndex: 3,
            lastIndex: 5
          });
          expect(result).to.deep.equal({
            firstIndex: 0,
            lastIndex: 1
          });
        });
      });

      describe('and it overlaps with the both', () => {
        it('should return an interval containing that index', () => {
          employeeNodeManager.employee.utilizations = [
            {topIndex: 4, bottomIndex: 6},
            {topIndex: 10, bottomIndex: 12}
          ];
          var result = employeeNodeManager._mapIndices({
            firstIndex: 3,
            lastIndex: 10
          });
          expect(result).to.deep.equal({
            firstIndex: 0,
            lastIndex: 2
          });
        });
      });

      describe('and it is before both', () => {
        it('should return 0, 0', () => {
          employeeNodeManager.employee.utilizations = [
            {topIndex: 4, bottomIndex: 6},
            {topIndex: 10, bottomIndex: 12}
          ];
          var result = employeeNodeManager._mapIndices({
            firstIndex: 0,
            lastIndex: 2
          });
          expect(result).to.deep.equal({
            firstIndex: 0,
            lastIndex: 0
          });
        });
      });

      describe('and it is after both', () => {
        it('should return 0, 0', () => {
          employeeNodeManager.employee.utilizations = [
            {topIndex: 4, bottomIndex: 6},
            {topIndex: 10, bottomIndex: 12}
          ];
          var result = employeeNodeManager._mapIndices({
            firstIndex: 14,
            lastIndex: 20
          });
          expect(result).to.deep.equal({
            firstIndex: 2,
            lastIndex: 2
          });
        });
      });
    });

    describe('when there are 2 employees at the same indices', () => {
      describe('and it overlaps with them both', () => {
        it('should return an interval containing both indices', () => {
          employeeNodeManager.employee.utilizations = [
            {topIndex: 4, bottomIndex: 6},
            {topIndex: 4, bottomIndex: 6}
          ];
          var result = employeeNodeManager._mapIndices({
            firstIndex: 3,
            lastIndex: 5
          });
          expect(result).to.deep.equal({
            firstIndex: 0,
            lastIndex: 2
          });
        });
      });

      describe('and it is before both', () => {
        it('should return 0, 0', () => {
          employeeNodeManager.employee.utilizations = [
            {topIndex: 4, bottomIndex: 6},
            {topIndex: 4, bottomIndex: 6}
          ];
          var result = employeeNodeManager._mapIndices({
            firstIndex: 0,
            lastIndex: 2
          });
          expect(result).to.deep.equal({
            firstIndex: 0,
            lastIndex: 0
          });
        });
      });

      describe('and it is after both', () => {
        it('should return 0, 0', () => {
          employeeNodeManager.employee.utilizations = [
            {topIndex: 4, bottomIndex: 6},
            {topIndex: 4, bottomIndex: 6}
          ];
          var result = employeeNodeManager._mapIndices({
            firstIndex: 14,
            lastIndex: 20
          });
          expect(result).to.deep.equal({
            firstIndex: 2,
            lastIndex: 2
          });
        });
      });
    });

    describe('when there are 3 employees', () => {
      describe('and it overlaps with them all', () => {
        it('should return an interval containing all indices', () => {
          employeeNodeManager.employee.utilizations = [
            {topIndex: 4, bottomIndex: 6},
            {topIndex: 8, bottomIndex: 8},
            {topIndex: 11, bottomIndex: 15}
          ];
          var result = employeeNodeManager._mapIndices({
            firstIndex: 3,
            lastIndex: 11
          });
          expect(result).to.deep.equal({
            firstIndex: 0,
            lastIndex: 3
          });
        });
      });

      describe('and it comes before them all', () => {
        it('should return an interval of 0,0', () => {
          employeeNodeManager.employee.utilizations = [
            {topIndex: 4, bottomIndex: 6},
            {topIndex: 8, bottomIndex: 8},
            {topIndex: 11, bottomIndex: 15}
          ];
          var result = employeeNodeManager._mapIndices({
            firstIndex: 1,
            lastIndex: 1
          });
          expect(result).to.deep.equal({
            firstIndex: 0,
            lastIndex: 0
          });
        });
      });

      describe('and it comes after them all', () => {
        it('should return an interval of 3,3', () => {
          employeeNodeManager.employee.utilizations = [
            {topIndex: 4, bottomIndex: 6},
            {topIndex: 8, bottomIndex: 8},
            {topIndex: 11, bottomIndex: 15}
          ];
          var result = employeeNodeManager._mapIndices({
            firstIndex: 100,
            lastIndex: 1100
          });
          expect(result).to.deep.equal({
            firstIndex: 3,
            lastIndex: 3
          });
        });
      });

      describe('and it contains just the first', () => {
        it('should return an interval of 0,1', () => {
          employeeNodeManager.employee.utilizations = [
            {topIndex: 4, bottomIndex: 6},
            {topIndex: 8, bottomIndex: 8},
            {topIndex: 11, bottomIndex: 15}
          ];
          var result = employeeNodeManager._mapIndices({
            firstIndex: 0,
            lastIndex: 4
          });
          expect(result).to.deep.equal({
            firstIndex: 0,
            lastIndex: 1
          });
        });
      });

      describe('and it contains just the second', () => {
        it('should return an interval of 1,2', () => {
          employeeNodeManager.employee.utilizations = [
            {topIndex: 4, bottomIndex: 6},
            {topIndex: 8, bottomIndex: 8},
            {topIndex: 11, bottomIndex: 15}
          ];
          var result = employeeNodeManager._mapIndices({
            firstIndex: 7,
            lastIndex: 8
          });
          expect(result).to.deep.equal({
            firstIndex: 1,
            lastIndex: 2
          });
        });
      });

      describe('and it contains just the third', () => {
        it('should return an interval of 2,3', () => {
          employeeNodeManager.employee.utilizations = [
            {topIndex: 4, bottomIndex: 6},
            {topIndex: 8, bottomIndex: 8},
            {topIndex: 11, bottomIndex: 15}
          ];
          var result = employeeNodeManager._mapIndices({
            firstIndex: 14,
            lastIndex: 15
          });
          expect(result).to.deep.equal({
            firstIndex: 2,
            lastIndex: 3
          });
        });
      });

      describe('and it contains the second and third', () => {
        it('should return an interval of 1,3', () => {
          employeeNodeManager.employee.utilizations = [
            {topIndex: 4, bottomIndex: 6},
            {topIndex: 8, bottomIndex: 8},
            {topIndex: 11, bottomIndex: 15}
          ];
          var result = employeeNodeManager._mapIndices({
            firstIndex: 8,
            lastIndex: 15
          });
          expect(result).to.deep.equal({
            firstIndex: 1,
            lastIndex: 3
          });
        });
      });
    });
  });
});
