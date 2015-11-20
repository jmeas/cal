import _ from 'lodash';
import EmployeeNodeManager from './employee-node-manager';

// This manages our EmployeeNodeManagers
function ManagerManager(options) {
  _.extend(this, options);
  this._createManagers();
}

_.extend(ManagerManager.prototype, {
  update({firstXIndex, lastXIndex, firstYIndex, lastYIndex}) {
    // If we have no current index, then this must be the first render
    if (_.isUndefined(this._firstYIndex)) {
      this._initialRender({firstXIndex, lastXIndex, firstYIndex, lastYIndex});
    }

    // Whether or not our indices have changed
    var yChanged = firstYIndex !== this._firstYIndex || lastYIndex !== this._lastYIndex;
    var xChanged = firstXIndex !== this._firstXIndex || lastXIndex !== this._lastXIndex;
    // If nothing has been updated, then bail
    if (!xChanged && !yChanged) { return; }

    // Start by computing whether we're moving left or right
    var xDirectionSign;
    if (this._firstXIndex !== 0) {
      xDirectionSign = firstXIndex < this._firstXIndex ? -1 : 1;
    } else {
      xDirectionSign = lastXIndex < this._lastXIndex ? -1 : 1;
    }

    // Calculate our change in both directions
    var backwardDelta = Math.abs(this._firstXIndex - firstXIndex);
    var forwardDelta = Math.abs(this._lastXIndex - lastXIndex);

    // How many we're deleting
    var removeDelta = xDirectionSign > 0 ? backwardDelta : forwardDelta;

    this._broadcastDelete({xDirectionSign, removeDelta, firstXIndex});

    // Broadcast our update.
    this._broadcastUpdate({
      firstXIndex,
      lastXIndex,
      firstYIndex,
      lastYIndex
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

  _initialRender({firstXIndex, lastXIndex, firstYIndex, lastYIndex}) {
    this._clearAll();
    this._broadcastUpdate({firstXIndex, lastXIndex, firstYIndex, lastYIndex});
    this._firstXIndex = firstXIndex;
    this._lastXIndex = lastXIndex;
    this._firstYIndex = firstYIndex;
    this._lastYIndex = lastYIndex;
  },

  // Ensure that all of our children are clear
  _clearAll() {
    this._managers.forEach(m => m.clear());
  },

  // This causes the employee node managers that have scrolled out of
  // view to clear all of their cells.
  _broadcastDelete({xDirectionSign, removeDelta, firstXIndex}) {
    var targetIndex, relativeIndex;
    _.times(removeDelta, n => {
      relativeIndex = xDirectionSign < 0 ? this._lastXIndex : firstXIndex - 1;
      targetIndex = relativeIndex - n;
      this._managers[targetIndex].clear();
    });
  },

  // Tell all of the managers between the X indices to intelligently render
  // based on the Y indices.
  _broadcastUpdate({firstXIndex, lastXIndex, firstYIndex, lastYIndex}) {
    var size = lastXIndex - firstXIndex + 1;
    _.times(size, n => {
      n += firstXIndex;
      this._managers[n].render({
        firstIndex: firstYIndex,
        lastIndex: lastYIndex
      });
    });
  }
});

export default ManagerManager;
