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

    // When the indices are the same, it means that we should
    // render nothing. So we clear shop and return.
    if (firstIndex === lastIndex) {
      this.clear();
      this._firstIndex = firstIndex;
      this._lastIndex = lastIndex;
      return;
    }

    // Subtract the last index
    lastIndex -= 1;

    // Nothing to update if the indices are unchanged
    if (firstIndex === this._firstIndex && lastIndex === this._lastIndex) {
      return;
    }

    var backwardDelta, forwardDelta, addDelta, removeDelta, referenceIndex, clear, currentSize;

    if (!_.isUndefined(this._firstIndex)) {
      backwardDelta = Math.abs(this._firstIndex - firstIndex);
      forwardDelta = Math.abs(this._lastIndex - lastIndex);
      removeDelta = direction > 0 ? backwardDelta : forwardDelta;
      addDelta = direction > 0 ? forwardDelta : backwardDelta;
      currentSize = this._lastIndex - this._firstIndex + 1;
    }

    if (!_.isUndefined(removeDelta) && removeDelta < currentSize) {
      referenceIndex = direction > 0 ? this._lastIndex : this._firstIndex;
      // Correct our index according to the direction that we're moving in. This
      // won't go over our limits because we check for the size of the `addDelta`, which
      // is determined by maths up in the AxisView, before we ever use this value.
      referenceIndex += direction;
      clear = false;
      this._removeNodes({direction, removeDelta});
    }

    else {
      clear = true;
      referenceIndex = firstIndex;
      direction = 1;
      addDelta = lastIndex - firstIndex + 1;
    }

    // Always check to see if we need to add nodes
    this._addNodes({
      direction,
      addDelta,
      clear,
      referenceIndex
    });

    this._firstIndex = firstIndex;
    this._lastIndex = lastIndex;
  },

  // Deletes all of the nodes
  clear() {
    _.each(this._children, c => {
      c.el.remove();
    });
    this._children = [];
    // Reset our indices so that the next render is a fresh one
    this._firstIndex = undefined;
    this._lastIndex = undefined;
  },

  // These indices keep track of where we begin and end
  _firstIndex: undefined,
  _lastIndex: undefined,

  _removeNodes({direction, removeDelta}) {
    // If we have no nodes, then there's nothing to remove!
    if (!this._children.length) { return; }

    var targetIndex, relativeIndex;
    _.times(removeDelta, n => {
      n = direction > 0 ? 0 : this._children.length - 1;
      // Remove the node from the page
      this._children[n].el.remove();
      // Remove the view from the children array
      this._children.splice(targetIndex, 1);
    });
  },

  _addNodes({direction, addDelta, referenceIndex, clear}) {
    if (!addDelta) { return; }

    // If we need to clear house, then we do so
    if (clear) {
      this.clear();
    }

    var fragment = document.createDocumentFragment();
    var view, absoluteIndex;
    _.times(addDelta, n => {
      // When we're prepending the nodes, we need to add them in reverse order.
      // Note that because `n` is 0-indexed, and `addDelta` is not, we must
      // correct the value by subtracting 1
      if (direction < 0) {
        n = addDelta - n - 1;
      }

      absoluteIndex = referenceIndex + (n * direction);
      view = this._createChildView(absoluteIndex);
      this._children.push(view);
      fragment.appendChild(view.el);
    });

    if (direction > 0) {
      this.el.appendChild(fragment);
    } else {
      this.el.insertBefore(fragment, this.el.firstChild);
    }
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
  },

  _createChildView(index) {
    var utilization = this.employee.utilizations[index];
    return new UtilizationView(utilization, this.index);
  }
});

export default EmployeeNodeManager;
