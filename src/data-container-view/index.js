import _ from 'lodash';
import UtilizationView from '../utilization-view';

function DataContainerView({employees}) {
  this.employees = employees;
  this._setEl();
}

_.extend(DataContainerView.prototype, {
  _setEl() {
    this.el = document.getElementsByClassName('data-container')[0];
    this.data = document.getElementsByClassName('data')[0];
  },

  render() {
    var views = [];
    this.employees.forEach(e => {
      e.utilizations.forEach(u => {
        views.push(new UtilizationView(u));
      });
    });

    var fragment = document.createDocumentFragment();
    views.forEach(v => fragment.appendChild(v.el));
    this.data.appendChild(fragment);
  }
});

export default DataContainerView;
