'use strict';

var _Number = require('./Number');

var _index = require('./fixtures/index');

var _harness = require('../../../test/harness');

describe('Number Component', function () {
  it('Should build an number component', function (done) {
    _harness.Harness.testCreate(_Number.NumberComponent, _index.components.comp1).then(function (component) {
      _harness.Harness.testElements(component, 'input[type="number"]', 1);
      done();
    });
  });
});