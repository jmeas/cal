import _ from 'lodash';
import EmployeeNodeManager from './employee-node-manager';

// This manages our EmployeeNodeManagers
function ManagerManager(options) {
  _.extend(this, options);
  this._createManagers();
}

_.extend(ManagerManager.prototype, {
  update({firstXIndex, lastXIndex, firstYIndex, lastYIndex, xDirection, yDirection}) {
    // Whether or not our indices have changed
    var yChanged = firstYIndex !== this._firstYIndex || lastYIndex !== this._lastYIndex;
    var xChanged = firstXIndex !== this._firstXIndex || lastXIndex !== this._lastXIndex;
    // If nothing has been updated, then bail
    if (!xChanged && !yChanged) { return; }

    var backwardDelta, forwardDelta, addDelta,
      addReferenceIndex, removeReferenceIndex,
      removeDelta, clear, currentSize;
    if (_.isUndefined(this._firstXIndex)) {
      backwardDelta = Math.abs(this._firstXIndex - firstXIndex);
      forwardDelta = Math.abs(this._lastXIndex - lastXIndex);
      removeDelta = xDirection > 0 ? backwardDelta : forwardDelta;
      currentSize = this._lastXIndex - this._firstXIndex + 1;
    }

    if (!_.isUndefined(removeDelta) && removeDelta < currentSize) {
      removeReferenceIndex = xDirection > 0 ? this._lastXIndex : this._firstXIndex;
      addReferenceIndex = removeReferenceIndex + xDirection;
      clear = false;
      this._broadcastDelete({
        direction: xDirection,
        removeDelta,
        referenceIndex: removeReferenceIndex
      });
    }

    else {
      clear = true;
      xDirection = 1;
      addReferenceIndex = firstXIndex;
      addDelta = lastXIndex - firstXIndex + 1;
    }

    // Broadcast our update.
    this._broadcastUpdate({
      clear,
      addDelta,
      xDirection,
      firstYIndex,
      lastYIndex,
      yDirection
    });

    // Update our indices
    this._firstXIndex = firstXIndex;
    this._lastXIndex = lastXIndex;
    this._firstYIndex = firstYIndex;
    this._lastYIndex = lastYIndex;
  },

  // These indices keep track of where we begin and end along each axis
  _firstXIndex: undefined,
  _lastXIndex: undefined,
  _firstYIndex: undefined,
  _lastYIndex: undefined,

  _createManagers() {
    this._managers = _.map(this.employees, (e, i) => new EmployeeNodeManager({
      employee: e,
      index: i,
      pool: this.pool,
      el: this.el
    }));
  },

  // Ensure that all of our children are clear
  _clearAll() {
    this._managers.forEach(m => m.clear());
  },

  // This causes the employee node managers that have scrolled out of
  // view to clear all of their cells.
  _broadcastDelete({direction, removeDelta, removeReferenceIndex}) {
    var targetIndex, relativeIndex;
    _.times(removeDelta, n => {
      if (direction < 0) {
        n = removeDelta - n;
      }
      targetIndex = removeReferenceIndex + (n * direction);
      this._managers[targetIndex].clear();
    });
  },

  // Tell all of the managers between the X indices to intelligently render
  // based on the Y indices.
  _broadcastUpdate({firstXIndex, lastXIndex, firstYIndex, lastYIndex, yDirection, clear}) {
    if (clear) {
      this._clearAll();
    }

    var size = lastXIndex - firstXIndex + 1;
    _.times(size, n => {
      n += firstXIndex;
      this._managers[n].render({
        firstIndex: firstYIndex,
        lastIndex: lastYIndex,
        direction: yDirection
      });
    });
  }
});

export default ManagerManager;
