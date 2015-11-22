import _ from 'lodash';

// This thing creates our "chunks," which are a slice of a long list of nodes. It uses
// DOM pooling to prevent garbage collection while the user scrolls. Tl;dr: it's dope.
function NodeListManager({el, displayProp, formatFn, unit, dim, pool}) {
  this.el = el;
  this.displayProp = displayProp;
  this.formatFn = formatFn || _.identity;
  this.dim = dim;
  this.unit = unit;
  this.pool = pool;
}

_.extend(NodeListManager.prototype, {
  // Populates the axis with the initial batch of elements
  initialRender({firstIndex, lastIndex, list}) {
    if (this.el.children.length) {
      this._clear();
    }
    var totalToAdd = lastIndex - firstIndex + 1;
    var fragment = document.createDocumentFragment();
    var el, val, formattedText;
    _.times(totalToAdd, n => {
      absoluteIndex = firstIndex + n;

      // Get our value from the list, based on index,
      // then format it according to the format fn
      val = list[absoluteIndex][this.displayProp];
      formattedText = this.formatFn(val);

      // Pop a node from the pool, then update its properties
      el = this.pool.pop();
      el.textContent = formattedText;
      el.style[this.dim] = `${this.unit * absoluteIndex}px`;
      fragment.appendChild(el);
    });
    this.el.appendChild(fragment);
    this._firstIndex = firstIndex;
    this._lastIndex = lastIndex;
  },

  // Updating is a two-part process: removing nodes that have
  // moved too far away, and then adding new nodes that are moving
  // into view
  update({firstIndex, lastIndex, list, direction}) {
    // Nothing to update if the indices are unchanged
    if (firstIndex === this._firstIndex && lastIndex === this._lastIndex) {
      return;
    }
    // If this manager has no indices, then it must be the first render.
    else if (_.isUndefined(this._firstIndex) || _.isUndefined(this._lastIndex)) {
      return this.initialRender({firstIndex, lastIndex, list});
    }

    var totalSize = lastIndex - firstIndex + 1;
    var backwardDelta = Math.abs(this._firstIndex - firstIndex);
    var forwardDelta = Math.abs(this._lastIndex - lastIndex);

    var removeDelta = direction > 0 ? backwardDelta : forwardDelta;
    var addDelta = direction > 0 ? forwardDelta : backwardDelta;

    // If the change is larger than the current size of the list, then we're
    // effectively redrawing it
    if (backwardDelta >= totalSize) {
      this.initialRender({firstIndex, lastIndex, list});
    }

    // Otherwise, we do an intelligent update by adding and removing nodes
    else {
      this._removeNodes({direction, removeDelta});
      this._addNodes({direction, list, addDelta});
      this._firstIndex = firstIndex;
      this._lastIndex = lastIndex;
    }
  },

  // These indices keep track of where we begin and end
  _firstIndex: undefined,
  _lastIndex: undefined,

  _createPool(size) {
    this.pool = new DomPool({
      tagName: 'div'
    });
    this.pool.allocate(this.initialPoolSize);
  },

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

  _addNodes({direction, list, addDelta}) {
    // Anchor ourselves based on the direction that we're moving toward
    var anchor = direction > 0 ? this._lastIndex : this._firstIndex;

    var fragment = document.createDocumentFragment();
    var el, formattedText, val, absoluteIndex;
    _.times(addDelta, n => {
      // When we're prepending the nodes, we need to add them in reverse order
      if (direction < 0) {
        n = addDelta - n;
      }

      absoluteIndex = anchor + (n * direction);

      // Get our value from the list, based on index,
      // then format it according to the format fn
      val = list[absoluteIndex][this.displayProp];
      formattedText = this.formatFn(val);
      el = this.pool.pop();
      el.textContent = formattedText;
      el.style[this.dim] = `${this.unit * absoluteIndex}px`;
      fragment.appendChild(el);
    });
    // Although the order of the nodes doesn't matter, it's not much
    // work to keep them in order, so we do!
    if (direction > 0) {
      this.el.appendChild(fragment);
    } else {
      this.el.insertBefore(fragment, this.el.firstChild);
    }
  }
});

export default NodeListManager;
