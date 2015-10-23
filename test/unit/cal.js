import cal from '../../src/cal';

describe('cal', () => {
  describe('Greet function', () => {
    beforeEach(() => {
      spy(cal, 'greet');
      cal.greet();
    });

    it('should have been run once', () => {
      expect(cal.greet).to.have.been.calledOnce;
    });

    it('should have always returned hello', () => {
      expect(cal.greet).to.have.always.returned('hello');
    });
  });
});
