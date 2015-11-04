import _ from 'lodash';
import names from './names';

// Width and height values
var widthUnit = 140;
var heightUnit = 35;

// Return a single utilization
function utilizationGenerator() {
  var leftIndex = _.random(0, 95);
  var topIndex = _.random(0, 249);
  var r = _.random(0, 255);
  var g = _.random(0, 255);
  var b = _.random(0, 255);
  return {
    name: 'Project X',
    height: _.random(1, 10) * heightUnit,
    width: widthUnit,
    leftIndex: leftIndex,
    topIndex: topIndex,
    left: leftIndex * widthUnit,
    top: topIndex * heightUnit,
    color: `rgba(${r},${g},${b},0.8)`
  };
}

function employeeGenerator({employeeCount = 0, utilizationCount = 0}) {
  var employees = [];
  var name;
  _.times(employeeCount, () => {
    name = _.sample(names);
    employees.push({
      name: name,
      charCode: name.charCodeAt(0),
      utilizations: _.times(utilizationCount, utilizationGenerator)
    });
  });
  return employees;
}

export default employeeGenerator;
