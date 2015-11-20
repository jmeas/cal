import _ from 'lodash';
import UtilizationView from '../utilization-view';

function EmployeeNodeManager(options) {
  _.extend(this, options);
  this._children = [];
}

_.extend(EmployeeNodeManager.prototype, {
  render({firstIndex, lastIndex, direction}) {
    // Map our indices
    var indices = this._mapIndices({firstIndex, lastIndex});
    firstIndex = indices.firstIndex;
    lastIndex = indices.lastIndex;

    // Nothing to update if the indices are unchanged
    if (firstIndex === this._firstIndex && lastIndex === this._lastIndex) {
      return;
    }

    // If this manager has no indices, then it must be the first render.
    else if (_.isUndefined(this._firstIndex) || _.isUndefined(this._lastIndex)) {
      return this._initialRender({firstIndex, lastIndex});
    }

    var totalSize = lastIndex - firstIndex + 1;
    var backwardDelta = Math.abs(this._firstIndex - firstIndex);
    var forwardDelta = Math.abs(this._lastIndex - lastIndex);

    var removeDelta = direction > 0 ? backwardDelta : forwardDelta;
    var addDelta = direction > 0 ? forwardDelta : backwardDelta;

    this._removeNodes({direction, removeDelta});
    this._addNodes({direction, list, addDelta});

    this._firstIndex = firstIndex;
    this._lastIndex = lastIndex;
  },

  // Deletes all of the nodes
  clear() {
    _.each(this._children, c => {
      c.el.remove();
    });
    this._children = [];
  },

  // These indices keep track of where we begin and end
  _firstIndex: undefined,
  _lastIndex: undefined,

  _removeNodes({direction, removeDelta}) {
    // If we have no nodes, then there's nothing to remove!
    // if (!this._children.length) { return; }

    // var targetNode, nodePosition;
    // var initialLength = this._children.length;
    // _.times(removeDelta, () => {
    //   // We either remove from the start or end of the list, depending
    //   // on the direction of scrolling
    //   nodePosition = direction > 0 ? 'firstChild' : 'lastChild';
    //   targetNode = this.el[nodePosition];
    //   // If the node exists, then we remove it and push back the element into the pool
    //   if (targetNode) {
    //     this.pool.push(this.el.removeChild(targetNode));
    //   }
    // });
  },

  _addNodes({direction, list, addDelta}) {},

  _initialRender({firstIndex, lastIndex}) {
    var size = lastIndex - firstIndex + 1;
    var fragment = document.createDocumentFragment();
    _.times(size, n => {
      n += firstIndex;
      var u = this.employee.utilizations[n];
      var uView = new UtilizationView(u, this.index);
      this._children.push(uView);
      fragment.appendChild(uView.el);
    });
    this.el.appendChild(fragment);

    this._firstIndex = firstIndex;
    this._lastIndex = lastIndex;
  },

  // The indices that we get from ManagerManager are not mapped to our utilization
  // space. This does that using Lodash's binary search algorithms.
  _mapIndices({firstIndex, lastIndex}) {
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
