import _ from 'lodash';
import names from './names';
import packingUtil from '../common/packing-util';

// Width and height values
var widthUnit = 140;
var heightUnit = 35;

// Return a single utilization
function utilizationGenerator() {
  var topIndex = _.random(0, 350);
  var height = _.random(1, 10);
  var r = _.random(0, 255);
  var g = _.random(0, 255);
  var b = _.random(0, 255);
  return {
    name: 'Project X',
    height: height * heightUnit,
    width: widthUnit,
    topIndex: topIndex,
    bottomIndex: topIndex + height - 1,
    top: topIndex * heightUnit,
    color: `rgba(${r},${g},${b},0.8)`
  };
}

function employeeGenerator({employeeCount = 0, utilizationCount = 0}) {
  var employees = [];
  var name, utilizations;
  _.times(employeeCount, n => {
    name = _.sample(names);
    utilizations = _.times(utilizationCount, () => {
      return utilizationGenerator();
    });
    utilizations = _.sortByOrder(utilizations, ['topIndex', 'height'], ['asc', 'desc']);
    packingUtil({
      rectangles: utilizations,
      startProp: 'topIndex',
      endProp: 'bottomIndex'
    });
    employees.push({
      name: name,
      charCode: name.charCodeAt(0),
      utilizations: utilizations
    });
  });
  return employees;
}

export default employeeGenerator;
