'use strict';

describe('bookingSystem.version module', function() {
  beforeEach(module('bookingSystem.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
