import _ from 'lodash';
import timelineGenerator from '../../util/timeline-generator';
import timeAxisGenerator from '../../util/time-axis-generator';

function TimeAxisView(options = {}) {
  this._setEl();
}

_.extend(TimeAxisView.prototype, {
  _setEl() {
    this.el = document.getElementsByClassName('y-axis')[0];
  },

  render() {
    var timeAxisData = timelineGenerator(new Date(), 260, 'days');
    var timeAxisList = timeAxisGenerator(timeAxisData);
    this.el.appendChild(timeAxisList);
    this.axisList = timeAxisList;
  }
});

export default TimeAxisView;
