import CalView from './view/cal-view';

var now = performance.now();
var calView = new CalView();
calView.render();

// start div test
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var widthUnit = 100;
var heightUnit = 35;

var div = document.createElement('div');
function RectangleDiv(container) {
  this.height = getRandomInt(1, 10) * heightUnit;
  this.width = widthUnit;
  this.left = getRandomInt(0, 95) * widthUnit;
  this.top = getRandomInt(0, 249) * heightUnit;
  var r = getRandomInt(0, 255);
  var g = getRandomInt(0, 255);
  var b = getRandomInt(0, 255);
  this.color = `rgba(${r},${g},${b},0.8)`;
  this.el = div.cloneNode(false);
  this.el.className = 'cell';
  this.el.style.top = `${this.top}px`;
  this.el.style.left = `${this.left}px`;
  this.el.style.width = `${this.width}px`;
  this.el.style.height = `${this.height}px`;
  this.el.style.backgroundColor = this.color;
}

RectangleDiv.prototype.createElement = function(tagName) {
  return document.createElement(tagName);
};

var count = 5100;
var rects = [];
for (var x = 0; x < count; x++) {
  rects.push(new RectangleDiv());
}

var fragment = document.createDocumentFragment();
rects.forEach(rect => {
  fragment.appendChild(rect.el);
});
var containerEl = document.getElementsByClassName('data')[0];
containerEl.appendChild(fragment);
// end div test

console.log(`Rendered ${count} in ${performance.now() - now} ms`);
