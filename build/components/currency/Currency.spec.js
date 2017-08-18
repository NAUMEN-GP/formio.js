'use strict';

var _Currency = require('./Currency');

var _index = require('./fixtures/index');

var _harness = require('../../../test/harness');

describe('Currency Component', function () {
  it('Should build a currency component', function (done) {
    _harness.Harness.testCreate(_Currency.CurrencyComponent, _index.components.comp1).then(function (component) {
      _harness.Harness.testElements(component, 'input[type="text"]', 1);
      done();
    });
  });
});