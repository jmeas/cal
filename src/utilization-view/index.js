var div = document.createElement('div');
var span = document.createElement('span');

function UtilizationView(utilization = {}, leftIndex) {
  this.el = div.cloneNode(false);
  var nameEl = span.cloneNode(false);
  var nameText = document.createTextNode(utilization.name);
  nameEl.appendChild(nameText);
  this.el.appendChild(nameEl);
  this.el.className = 'cell';
  this.el.style.top = `${utilization.top}px`;
  this.el.style.left = `${leftIndex * utilization.width}px`;
  this.el.style.width = `${utilization.width}px`;
  this.el.style.height = `${utilization.height}px`;
  this.el.style.backgroundColor = utilization.color;
}

export default UtilizationView;
