import names from './names';

// Generate a random integer
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Width and height values
var widthUnit = 100;
var heightUnit = 35;

// Return a single utilization
function utilizationGenerator() {
  var leftIndex = getRandomInt(0, 95);
  var topIndex = getRandomInt(0, 249);
  var r = getRandomInt(0, 255);
  var g = getRandomInt(0, 255);
  var b = getRandomInt(0, 255);
  return {
    name: 'Project X',
    height: getRandomInt(1, 10) * heightUnit,
    width: widthUnit,
    leftIndex: leftIndex,
    topIndex: topIndex,
    left: leftIndex * widthUnit,
    top: topIndex * heightUnit,
    color: `rgba(${r},${g},${b},0.8)`
  };
}

// Return a list of utilizations
function utilizationsGenerator() {
  // Each employee has this many utilizations
  var size = 0;

  if (size === 0) {
    return [];
  }

  var utilizations = [];
  for (var i = 0; i <= size; i++) {
    utilizations.push(utilizationGenerator());
  }
  return utilizations;
}

function getRandomName() {
  var index = getRandomInt(0, names.length - 1);
  return names[index];
}

function employeeGenerator(length = 0) {
  var employees = [];
  var name;
  for (var i = 0; i < length; i++) {
    name = getRandomName();
    employees.push({
      name: name,
      charCode: name.charCodeAt(0),
      utilizations: utilizationsGenerator()
    });
  }
  return employees;
}

export default employeeGenerator;
