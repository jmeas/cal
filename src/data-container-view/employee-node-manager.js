import _ from 'lodash';
import UtilizationView from '../utilization-view';

function EmployeeNodeManager(options) {
  _.extend(this, options);
}

_.extend(EmployeeNodeManager.prototype, {
  render({firstIndex, lastIndex}) {
    // Nothing to update if the indices are unchanged
    if (firstIndex === this._firstIndex && lastIndex === this._lastIndex) {
      return;
    }

    // If this manager has no indices, then it must be the first render.
    else if (_.isUndefined(this._firstIndex) || _.isUndefined(this._lastIndex)) {
      return this._initialRender({firstIndex, lastIndex});
    }

    this._firstIndex = firstIndex;
    this._lastIndex = lastIndex;
  },

  clear() {
    // console.log('deleting');
  },

  // These indices keep track of where we begin and end
  _firstIndex: undefined,
  _lastIndex: undefined,

  _initialRender({firstIndex, lastIndex}) {
    var indices = this._mapIndex({firstIndex, lastIndex});

    var size = indices.lastIndex - indices.firstIndex + 1;
    var fragment = document.createDocumentFragment();
    _.times(size, n => {
      n += indices.firstIndex;
      var u = this.employee.utilizations[n];
      var uView = new UtilizationView(u);
      fragment.appendChild(uView.el);
    });
    this.el.appendChild(fragment);

    this._firstIndex = firstIndex;
    this._lastIndex = lastIndex;
  },

  // The indices that we get from ManagerManager are not mapped to our utilization
  // space. This does that using Lodash's binary search algorithms.
  _mapIndex({firstIndex, lastIndex}) {
    var utilizations = this.employee.utilizations;
    var firstUtilizationIndex = _.sortedIndex(utilizations, {
      bottomIndex: firstIndex
    }, 'bottomIndex');
    var lastUtilizationIndex = _.sortedLastIndex(utilizations, {
      topIndex: lastIndex
    }, 'topIndex');

    return {
      firstIndex: firstUtilizationIndex,
      lastIndex: lastUtilizationIndex
    };
  }
});

export default EmployeeNodeManager;
