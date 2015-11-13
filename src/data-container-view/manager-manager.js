import _ from 'lodash';

// This manages our EmployeeNodeManagers
function ManagerManager(options) {
  _.extend(this, options);
}

_.extend(ManagerManager.prototype, {
  update({}) {
    console.log('rendering!', firstIndex, lastIndex);
  },

    // These indices keep track of where we begin and end along each axis
  _firstXIndex: undefined,
  _lastXIndex: undefined,
  _firstYIndex: undefined,
  _lastYIndex: undefined,
});

export default ManagerManager;
