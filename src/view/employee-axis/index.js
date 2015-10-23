import _ from 'lodash';
import employeesAxisGenerator from '../../util/employees-axis-generator';

function EmployeeAxisView(options = {}) {
  this._setEl();
}

_.extend(EmployeeAxisView.prototype, {
  _setEl() {
    this.el = document.getElementsByClassName('x-axis')[0];
  },

  render() {
    var employeeAxisData = new Array(40);
    employeeAxisData.fill('Someone');
    var employeeAxisList = employeesAxisGenerator(employeeAxisData);
    this.el.appendChild(employeeAxisList);
    this.axisList = employeeAxisList;
  }
});

export default EmployeeAxisView;
