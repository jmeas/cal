import _ from 'lodash';
import EmployeeNodeManager from './employee-node-manager';

// This manages our EmployeeNodeManagers
function ManagerManager(options) {
  _.extend(this, options);
  this._createManagers();
}

_.extend(ManagerManager.prototype, {
  update(options) {
    // console.log('rendering!', options);
  },

  // These indices keep track of where we begin and end along each axis
  _firstXIndex: undefined,
  _lastXIndex: undefined,
  _firstYIndex: undefined,
  _lastYIndex: undefined,

  _createManagers() {
    this._managers = _.map(this.employees, e => new EmployeeNodeManager({
      employee: e,
      pool: this.pool
    }));
  }
});

export default ManagerManager;
