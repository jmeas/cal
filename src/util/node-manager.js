import _ from 'lodash';
import dateFormatter from './date-formatter';
import DomPool from 'dom-pool';

// This thing creates our "chunks," which are a slice of a long list of nodes. It uses
// DOM pooling to prevent garbage collection while the user scrolls. Tl;dr: it's dope.
function NodeManager({ initialPoolSize, el, maxIndex, list, displayProp, formatFn, unit, dim }) {
  this.initialPoolSize = initialPoolSize;
  this.el = el;
  this.list = list;
  this.displayProp = displayProp;
  this.formatFn = formatFn || _.identity;
  this.maxIndex = maxIndex;
  this.dim = dim;
  this.unit = unit;
  this.createPool();
}

_.extend(NodeManager.prototype, {
  // These indices keep track of where we begin and end
  firstIndex: undefined,
  lastIndex: undefined,

  createPool(size) {
    this.pool = new DomPool({
      tagName: 'div'
    });
    this.pool.allocate(this.initialPoolSize);
  },

  // Updating is a two-part process: removing nodes that have
  // moved too far away, and then adding new nodes that are moving
  // into view
  update({firstIndex, lastIndex}) {
    // Determine whether we're going forward or back
    if (firstIndex < this.firstIndex) {
      var directionSign = -1;
    }
    var options = {firstIndex, lastIndex, directionSign};
    this.removeNodes(options);
    this.addNodes(options);
    this.firstIndex = firstIndex;
    this.lastIndex = lastIndex;
  },

  removeNodes({firstIndex, lastIndex, directionSign}) {
    // If we have no nodes, then there's nothing to remove!
    if (this.el.children.length === 0) { return; }

    // Determine if we're removing from the front of back, based on the direction
    var target = directionSign ? firstIndex : lastIndex;
    var current = directionSign ? this.firstIndex : this.lastIndex;

    var totalToRemove = Math.abs(current - target);
    var targetIndex, targetNode;
    _.times(totalToRemove, n => {
      // We're either removing from the beginning or the end
      targetIndex = directionSign ? n : this.el.children.length - 1 - n;
      targetNode = this.el.children[targetIndex];
      // If the node exists, we remove it and add it back to the pool
      if (targetNode) {
        targetNode.remove();
        this.pool.push(targetNode);
      }
    });
  },

  addNodes({firstIndex, lastIndex, directionSign}) {
    // Determine if we're adding to the front of back, based on the direction
    var target = directionSign ? lastIndex : firstIndex;
    var current = directionSign ? this.lastIndex : this.firstIndex;

    var totalToAdd;
    // If we have no nodes, then we render the entire span of the indices
    if (!this.el.children.length === 0) {
      totalToAdd = lastIndex - firstIndex;
    }
    // Otherwise, we only look at the difference between our current and target and index
    else {
      totalToAdd = Math.abs(current - target);
    }

    var fragment = document.createDocumentFragment();
    var el, formattedText, val, absoluteIndex;
    _.times(totalToAdd, n => {
      // When we're prepending the nodes, we need to add them in reverse order
      if (!directionSign) {
        n = toAdd - n;
        n--;
      } else {
        n++;
      }

      absoluteIndex = current + n;
      // Get our value from the list, based on index,
      // then format it according to the format fn
      val = this.list[absoluteIndex];
      formattedText = this.formatFn(val);
      el = this.pool.pop();
      el.textContent = formattedText;
      el.style[this.dim] = `${this.unit * absoluteIndex}px`;
      fragment.append(el);
    });
    // Although the order of the nodes doesn't matter, it's not much
    // work to keep them in order, so we do!
    if (directionSign) {
      this.el.appendChild(fragment);
    } else {
      this.el.insertBefore(fragment, this.el.firstChild);
    }
  }
});

export default NodeManager;
