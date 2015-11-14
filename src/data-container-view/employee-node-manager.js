import _ from 'lodash';

function EmployeeNodeManager(options) {
  _.extend(this, options);
}

_.extend(EmployeeNodeManager.prototype, {
  render({firstIndex, lastIndex}) {
    // console.log('rendering!', firstIndex, lastIndex);
  },

  clear() {
    // console.log('deleting');
  }
});

export default EmployeeNodeManager;
