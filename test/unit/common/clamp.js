import clamp from '../../../src/common/clamp';

describe('clamp', () => {
  it('should be a function', () => {
    expect(clamp).to.be.a('function');
  });

  it('should return the same number when it is passed within range', () => {
    expect(clamp(5, 0, 10)).to.equal(5);
  });

  it('should return the min number when it is below the range', () => {
    expect(clamp(-2, 0, 10)).to.equal(0);
  });

  it('should return the max number when it is above the range', () => {
    expect(clamp(12, 0, 10)).to.equal(10);
  });
});
