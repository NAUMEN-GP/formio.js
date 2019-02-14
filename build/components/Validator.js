'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Validator = undefined;

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _each2 = require('lodash/each');

var _each3 = _interopRequireDefault(_each2);

var _has2 = require('lodash/has');

var _has3 = _interopRequireDefault(_has2);

var _isNumber2 = require('lodash/isNumber');

var _isNumber3 = _interopRequireDefault(_isNumber2);

var _index = require('../utils/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Validator = exports.Validator = {
  get: _get3.default,
  each: _each3.default,
  has: _has3.default,
  checkValidator: function checkValidator(component, validator, setting, value, data) {
    // Make sure this component isn't conditionally disabled.
    if (!_index2.default.checkCondition(component.component, data, component.data)) {
      return '';
    }

    var result = validator.check.call(this, component, setting, value, data);
    if (typeof result === 'string') {
      return result;
    }
    if (!result) {
      return validator.message.call(this, component, setting);
    }
    return '';
  },
  validate: function validate(component, validator, value, data) {
    if (validator.key && (0, _has3.default)(component.component, validator.key)) {
      var setting = this.get(component.component, validator.key);
      return this.checkValidator(component, validator, setting, value, data);
    }
    return this.checkValidator(component, validator, null, value, data);
  },
  check: function check(component, data) {
    var _this = this;

    var result = '';
    var value = component.getRawValue();
    data = data || component.data;
    (0, _each3.default)(component.validators, function (name) {
      if (_this.validators.hasOwnProperty(name)) {
        var validator = _this.validators[name];
        if (name !== 'required' && component.validateMultiple(value)) {
          (0, _each3.default)(value, function (val) {
            result = _this.validate(component, validator, val, data);
            if (result) {
              return false;
            }
          });
        } else {
          result = _this.validate(component, validator, value, data);
        }
        if (result) {
          return false;
        }
      }
    });
    return result;
  },
  validators: {
    required: {
      key: 'validate.required',
      message: function message(component, setting) {
        return component.t('required', { field: component.errorLabel });
      },
      check: function check(component, setting, value) {
        if (!_index2.default.boolValue(setting)) {
          return true;
        }
        if (component.component.type == 'checkbox') {
          return !component.isEmpty(value) && value;
        }
        return !component.isEmpty(value);
      }
    },
    min: {
      key: 'validate.min',
      message: function message(component, setting) {
        return component.t('min', {
          field: component.errorLabel,
          min: parseFloat(setting)
        });
      },
      check: function check(component, setting, value) {
        var min = parseFloat(setting);
        if (!min || !(0, _isNumber3.default)(value)) {
          return true;
        }
        return parseFloat(value) >= min;
      }
    },
    max: {
      key: 'validate.max',
      message: function message(component, setting) {
        return component.t('max', {
          field: component.errorLabel,
          max: parseFloat(setting)
        });
      },
      check: function check(component, setting, value) {
        var max = parseFloat(setting);
        if (!max || !(0, _isNumber3.default)(value)) {
          return true;
        }
        return parseFloat(value) <= max;
      }
    },
    minLength: {
      key: 'validate.minLength',
      message: function message(component, setting) {
        return component.t('minLength', {
          field: component.errorLabel,
          length: setting - 1
        });
      },
      check: function check(component, setting, value) {
        var minLength = parseInt(setting, 10);
        if (!minLength || typeof value !== 'string') {
          return true;
        }
        return value.length >= minLength;
      }
    },
    maxLength: {
      key: 'validate.maxLength',
      message: function message(component, setting) {
        return component.t('maxLength', {
          field: component.errorLabel,
          length: setting + 1
        });
      },
      check: function check(component, setting, value) {
        var maxLength = parseInt(setting, 10);
        if (!maxLength || typeof value !== 'string') {
          return true;
        }
        if (component.type === 'textarea' && component.component.wysiwyg) {
          return component.htmlToPlainText(value).length <= maxLength;
        } else {
          return value.length <= maxLength;
        }
      }
    },
    email: {
      message: function message(component, setting) {
        return component.t('invalid_email', {
          field: component.errorLabel
        });
      },
      check: function check(component, setting, value) {
        // From http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return component.isEmpty(value) || re.test(value);
      }
    },
    date: {
      message: function message(component, setting) {
        return component.t('invalid_date', {
          field: component.errorLabel
        });
      },
      check: function check(component, setting, value) {
        return value !== 'Invalid date';
      }
    },
    pattern: {
      key: 'validate.pattern',
      message: function message(component, setting) {
        return component.t('pattern', {
          field: component.errorLabel
        });
      },
      check: function check(component, setting, value) {
        var pattern = setting;
        if (!pattern) {
          return true;
        }
        var regexStr = '^' + pattern + '$';
        var regex = new RegExp(regexStr);
        return regex.test(value);
      }
    },
    json: {
      key: 'validate.json',
      check: function check(component, setting, value, data) {
        if (!setting) {
          return true;
        }
        var valid = true;
        try {
          valid = _index2.default.jsonLogic.apply(setting, {
            data: data,
            row: component.data
          });
        } catch (err) {
          valid = err.message;
        }
        return valid;
      }
    },
    custom: {
      key: 'validate.custom',
      message: function message(component) {
        return component.t('custom', {
          field: component.errorLabel
        });
      },
      check: function check(component, setting, value, data) {
        if (!setting) {
          return true;
        }
        var valid = true;
        var row = component.data;
        var custom = setting;
        /*eslint-disable no-unused-vars */
        var input = value;
        /*eslint-enable no-unused-vars */
        custom = custom.replace(/({{\s+(.*)\s+}})/, function (match, $1, $2) {
          if ($2.indexOf('data.') === 0) {
            return (0, _get3.default)(data, $2.replace('data.', ''));
          } else if ($2.indexOf('row.') === 0) {
            return (0, _get3.default)(row, $2.replace('row.', ''));
          }

          // Support legacy...
          return (0, _get3.default)(data, $2);
        });

        /* jshint evil: true */
        eval(custom);
        return valid;
      }
    }
  }
};