import _ from 'lodash';
import CalView from './view/cal-view';
import employeeGenerator from './util/employee-generator';

// How many employees we're testing out
var employeeCount = 96;
// This is how many total utilizations we render
var count = 96 * 100;

var employees = employeeGenerator(employeeCount);
employees = _.sortBy(employees, 'name');

// Let's keep track of how performant we're being
var start = performance.now();

var calView = new CalView({employees});
calView.render();

console.log(`Rendered ${count} in ${performance.now() - start} ms`);
