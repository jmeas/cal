import getElementByHook from '../../../src/common/get-element-by-hook';

describe('getElementByHook', () => {
  it('should be a function', () => {
    expect(getElementByHook).to.be.a('function');
  });

  describe('when nothing matches', () => {
    it('should return `null`', () => {
      var result = getElementByHook('sandwiches');
      expect(result).to.be.null;
    });
  });

  /*
   * This cannot be tested with JSDom
   * https://github.com/tmpvar/jsdom/pull/963
   */
  // describe('when an element matches', () => {
  //   var node;
  //   beforeEach(() => {
  //     var node = document.createElement('div');
  //     node.setAttribute('data-sandwiches', '');
  //     document.querySelector('body').appendChild(node);
  //   });

  //   afterEach(() => {
  //     node.remove();
  //   });

  //   it('should return the node', () => {
  //     var result = getElementByHook('sandwiches');
  //     expect(result).to.equal(node);
  //   });
  // });
});
