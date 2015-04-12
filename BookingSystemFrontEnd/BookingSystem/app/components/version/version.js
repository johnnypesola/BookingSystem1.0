'use strict';

angular.module('bookingSystem.version', [
  'bookingSystem.version.interpolate-filter',
  'bookingSystem.version.version-directive'
])

.value('version', '0.1');
