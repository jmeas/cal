import _ from 'lodash';
import ListView from '../list-view';
import UtilizationView from '../utilization-view';
import ManagerManager from './manager-manager';

// Assuming 20 people are rendered, with 40  dates,
// this is the maximum size of what could be displayed (20 * 40 = 800)
const DEFAULT_POOL_SIZE = 800;
const X_PADDING = 3;
const Y_PADDING = 10;

const MAX_X_SPEED = 6;
const MAX_Y_SPEED = 6;

function DataContainerView(options) {
  ListView.call(this, options);
}

// "Extend" from the ListView
DataContainerView.prototype = _.create(ListView.prototype, {
  constructor: DataContainerView
});

_.extend(DataContainerView.prototype, {
  poolSize: DEFAULT_POOL_SIZE,

  _createManager() {
    return new ManagerManager({
      employees: this.employees,
      el: this.container
    });
  },

  _computeManagerOptions(options) {
    var {left, top, width, height, xDirection, yDirection} = options;
    if (_.isUndefined(left)) {
      left = this.initialXIndex;
    }
    if (_.isUndefined(top)) {
      top = this.initialYIndex;
    }

    // Pad the indices
    var xIndices = this._computeIndices({
      offset: left,
      length: width,
      min: 0,
      max: this.employees.length - 1,
      padding: X_PADDING
    });

    var yIndices = this._computeIndices({
      offset: top,
      length: height,
      min: 0,
      max: this.timeline.length - 1,
      padding: Y_PADDING
    });

    return {
      firstXIndex: xIndices.firstIndex,
      lastXIndex: xIndices.lastIndex,
      firstYIndex: yIndices.firstIndex,
      lastYIndex: yIndices.lastIndex,
      xDirection,
      yDirection
    };
  }
});

export default DataContainerView;
