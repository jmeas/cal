import _ from 'lodash';
import CalView from './cal-view';
import employeeGenerator from './mock/employee-generator';

// How many employees we're testing out
var employeeCount = 96;
// This is how many total utilizations we render
var utilizationCount = 400;

var employees = employeeGenerator({employeeCount, utilizationCount});
employees = _.sortBy(employees, 'name');

// console.log('employees:', employees);

// Let's keep track of how performant we're being
var start = performance.now();

var date = new Date();
var calView = new CalView({employees, date});
calView.render();

var time = performance.now() - start;
var msg = `${utilizationCount} utilizations for ${employeeCount} employees rendered in ${time} ms`;
console.log(msg);
