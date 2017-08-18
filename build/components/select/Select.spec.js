'use strict';

var _Select = require('./Select');

var _index = require('./fixtures/index');

var _harness = require('../../../test/harness');

describe('Select Component', function () {
  it('Should build a Select component', function (done) {
    _harness.Harness.testCreate(_Select.SelectComponent, _index.components.comp1).then(function (component) {
      _harness.Harness.testElements(component, 'select', 1);
      done();
    });
  });
});