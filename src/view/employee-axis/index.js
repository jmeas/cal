import _ from 'lodash';
import employeeGenerator from '../../util/employee-generator';
import employeesAxisGenerator from '../../util/employees-axis-generator';

function EmployeeAxisView({employees}) {
  this.employees = employees;
  this._setEl();
}

_.extend(EmployeeAxisView.prototype, {
  _setEl() {
    this.el = document.getElementsByClassName('x-axis')[0];
  },

  render() {
    var employeeAxisList = employeesAxisGenerator(this.employees);
    this.el.appendChild(employeeAxisList);
    this.axisList = employeeAxisList;
  }
});

export default EmployeeAxisView;
