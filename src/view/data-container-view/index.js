import _ from 'lodash';

function DataContainerView(options = {}) {
  this._setEl();
}

_.extend(DataContainerView.prototype, {
  _setEl() {
    this.el = document.getElementsByClassName('data-container')[0];
    this.data = document.getElementsByClassName('data')[0];
  }
});

export default DataContainerView;
