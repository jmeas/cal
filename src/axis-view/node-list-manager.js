import _ from 'lodash';
import DomPool from 'dom-pool';

// This thing creates our "chunks," which are a slice of a long list of nodes. It uses
// DOM pooling to prevent garbage collection while the user scrolls. Tl;dr: it's dope.
function NodeListManager({initialPoolSize, el, displayProp, formatFn, unit, dim}) {
  this.initialPoolSize = initialPoolSize;
  this.el = el;
  this.displayProp = displayProp;
  this.formatFn = formatFn || _.identity;
  this.dim = dim;
  this.unit = unit;
  this.createPool();
}

_.extend(NodeListManager.prototype, {
  // These indices keep track of where we begin and end
  firstIndex: undefined,
  lastIndex: undefined,

  createPool(size) {
    this.pool = new DomPool({
      tagName: 'div'
    });
    this.pool.allocate(this.initialPoolSize);
  },

  // Ensure that the element is empty
  clear() {
    while (this.el.firstChild) {
      this.pool.push(this.el.removeChild(this.el.firstChild));
    }
  },

  // Populates the axis with the initial batch of elements
  initialRender({firstIndex, lastIndex, list}) {
    if (this.el.children.length) {
      this.clear();
    }
    var totalToAdd = lastIndex - firstIndex;
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
    this.firstIndex = firstIndex;
    this.lastIndex = lastIndex;
  },

  // Updating is a two-part process: removing nodes that have
  // moved too far away, and then adding new nodes that are moving
  // into view
  update({firstIndex, lastIndex, list}) {
    // Nothing to update if the indices are unchanged
    if (firstIndex === this.firstIndex && lastIndex === this.lastIndex) {
      return;
    }
    // If this manager has no indices, then it must be the first render.
    else if (_.isUndefined(this.firstIndex) || _.isUndefined(this.lastIndex)) {
      return this.initialRender({firstIndex, lastIndex, list});
    }

    // Determine whether we're going forward or back. If we have
    // no children, we just assume that we're going forward.
    var directionSign;
    if (this.firstIndex !== 0) {
      directionSign = firstIndex < this.firstIndex ? -1 : 1;
    } else {
      directionSign = lastIndex < this.lastIndex ? -1 : 1;
    }

    var totalSize = lastIndex - firstIndex;
    var backwardDelta = Math.abs(this.firstIndex - firstIndex);
    var forwardDelta = Math.abs(this.lastIndex - lastIndex);

    var removeDelta = directionSign > 0 ? backwardDelta : forwardDelta;
    var addDelta = directionSign > 0 ? forwardDelta : backwardDelta;

    // If the change is larger than the current size of the list, then we're
    // effectively redrawing it
    if (backwardDelta >= totalSize) {
      this.initialRender({firstIndex, lastIndex, list});
    }

    // Otherwise, we do an intelligent update by adding and removing nodes
    else {
      this.removeNodes({directionSign, removeDelta});
      this.addNodes({directionSign, list, totalSize, addDelta});
      this.firstIndex = firstIndex;
      this.lastIndex = lastIndex;
    }
  },

  removeNodes({directionSign, removeDelta}) {
    // If we have no nodes, then there's nothing to remove!
    if (!this.el.children.length) { return; }

    var targetNode, nodePosition;
    var initialLength = this.el.children.length;
    _.times(removeDelta, () => {
      // We either remove from the start or end of the list, depending
      // on the direction of scrolling
      nodePosition = directionSign > 0 ? 'firstChild' : 'lastChild';
      targetNode = this.el[nodePosition];
      // If the node exists, then we remove it and push back the element into the pool
      if (targetNode) {
        this.pool.push(this.el.removeChild(targetNode));
      }
    });
  },

  addNodes({directionSign, list, totalSize, addDelta}) {
    // Anchor ourselves based on the direction that we're moving toward
    var anchor = directionSign > 0 ? this.lastIndex : this.firstIndex;

    var fragment = document.createDocumentFragment();
    var el, formattedText, val, absoluteIndex;
    _.times(addDelta, n => {
      // When we're prepending the nodes, we need to add them in reverse order
      if (directionSign < 0) {
        n = addDelta - n;
      }

      absoluteIndex = anchor + (n * directionSign);

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
    if (directionSign > 0) {
      this.el.appendChild(fragment);
    } else {
      this.el.insertBefore(fragment, this.el.firstChild);
    }
  }
});

export default NodeListManager;
