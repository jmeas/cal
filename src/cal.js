import timelineGenerator from './util/timeline-generator';
import timeAxisGenerator from './util/time-axis-generator';

var timeline = timelineGenerator(new Date(), 90, 'days');
var one = performance.now();
var timeAxis = timeAxisGenerator(timeline);

import employeesAxisGenerator from './util/employees-axis-generator';
var employees = new Array(100);
employees.fill('Someone');
var two = performance.now();
var emps = employeesAxisGenerator(employees);

var xAxis = document.getElementsByClassName('x-axis')[0];
var yAxis = document.getElementsByClassName('y-axis')[0];

yAxis.appendChild(timeAxis);
xAxis.appendChild(emps);

const cal = {
  greet() {
    return 'hello';
  }
};

export default cal;
