import quantize from '../../../src/common/quantize';

describe('quantize', () => {
  it('should be a function', () => {
    expect(quantize).to.be.a('function');
  });

  it('should quantize values that divide evenly correctly', function() {
    expect(quantize(9, 3)).to.equal(3);
    expect(quantize(100, 2)).to.equal(50);
    expect(quantize(25, 5)).to.equal(5);
  });

  it('should quantize values that do not divide evenly correctly', function() {
    expect(quantize(9, 2)).to.equal(4);
    expect(quantize(12, 5)).to.equal(2);
    expect(quantize(77, 25)).to.equal(3);
  });
});
