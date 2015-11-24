import _ from 'lodash';

// This thing creates our "chunks," which are a slice of a long list of nodes. It uses
// DOM pooling to prevent garbage collection while the user scrolls. Tl;dr: it's dope.
function NodeListManager(options = {}) {
  _.defaults(options, {
    formatFn: _.identity
  });
  _.extend(this, options);
}

_.extend(NodeListManager.prototype, {
  // Updating is a two-part process: removing nodes that have
  // moved too far away, and then adding new nodes that are moving
  // into view
  update({firstIndex, lastIndex, direction}) {
    // Nothing to update if the indices are unchanged
    if (firstIndex === this._firstIndex && lastIndex === this._lastIndex) {
      return;
    }

    var backwardDelta, forwardDelta, addDelta, removeDelta, referenceIndex, clear, currentSize;

    // If we have a first index, then that means that we already have children nodes.
    // We use this information to calculate how many we need to add and remove.
    if (!_.isUndefined(this._firstIndex)) {
      backwardDelta = Math.abs(this._firstIndex - firstIndex);
      forwardDelta = Math.abs(this._lastIndex - lastIndex);
      removeDelta = direction > 0 ? backwardDelta : forwardDelta;
      addDelta = direction > 0 ? forwardDelta : backwardDelta;
      currentSize = this._lastIndex - this._firstIndex + 1;
    }

    // If we have a `removeDelta`, and it's less than the total number of nodes
    // that we have rendered, then we do a regular smart update
    if (!_.isUndefined(removeDelta) && removeDelta < currentSize) {
      referenceIndex = direction > 0 ? this._lastIndex : this._firstIndex;
      clear = false;
      this._removeNodes({direction, removeDelta});
    }

    // Otherwise, we set ourselves up for a fresh update. This handles both the initial
    // render and subsequent "big renders" which draw a whole new list
    else {
      clear = true;
      referenceIndex = firstIndex - 1;
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

  // These indices keep track of where we begin and end
  _firstIndex: undefined,
  _lastIndex: undefined,

  // Ensure that the element is empty
  _clear() {
    while (this.el.firstChild) {
      this.pool.push(this.el.removeChild(this.el.firstChild));
    }
  },

  _removeNodes({direction, removeDelta}) {
    // If we have no nodes, then there's nothing to remove!
    if (!this.el.children.length) { return; }

    var targetNode, nodePosition;
    var initialLength = this.el.children.length;
    _.times(removeDelta, () => {
      // We either remove from the start or end of the list, depending
      // on the direction of scrolling
      nodePosition = direction > 0 ? 'firstChild' : 'lastChild';
      targetNode = this.el[nodePosition];
      // If the node exists, then we remove it and push back the element into the pool
      if (targetNode) {
        this.pool.push(this.el.removeChild(targetNode));
      }
    });
  },

  _addNodes({direction, addDelta, clear, referenceIndex}) {
    // If there's nothing to add, then bail
    if (!addDelta) { return; }

    // If we need to clear house, then we do so
    if (clear) {
      this._clear();
    }

    // Anchor ourselves based on the direction that we're moving toward
    var anchor = referenceIndex;

    var fragment = document.createDocumentFragment();
    var el, absoluteIndex;
    _.times(addDelta, n => {
      // When we're prepending the nodes, we need to add them in reverse order
      if (direction < 0) {
        n = addDelta - n;
      }
      // If we're adding the nodes, then we need to add one to make the
      // algorithm work. Gotta figure out why this is, and refactor
      // the code to be a little less ad hoc.
      else {
        n++;
      }

      absoluteIndex = anchor + (n * direction);

      el = this._createElementByIndex(absoluteIndex);
      fragment.appendChild(el);
    });
    // Although the order of the nodes doesn't matter, it's not much
    // work to keep them in order, so we do!
    if (direction > 0) {
      this.el.appendChild(fragment);
    } else {
      this.el.insertBefore(fragment, this.el.firstChild);
    }
  },

  // Returns an element representing the element at `index`
  _createElementByIndex(index) {
    var value = this.list[index][this.displayProp];
    value = this.formatFn(value);
    var el = this.pool.pop();
    el.textContent = value;
    el.style[this.dim] = `${this.unit * index}px`;
    return el;
  }
});

export default NodeListManager;
