'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NumberComponent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Base = require('../base/Base');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NumberComponent = exports.NumberComponent = function (_BaseComponent) {
  _inherits(NumberComponent, _BaseComponent);

  function NumberComponent() {
    _classCallCheck(this, NumberComponent);

    return _possibleConstructorReturn(this, (NumberComponent.__proto__ || Object.getPrototypeOf(NumberComponent)).apply(this, arguments));
  }

  _createClass(NumberComponent, [{
    key: 'elementInfo',
    value: function elementInfo() {
      var info = _get(NumberComponent.prototype.__proto__ || Object.getPrototypeOf(NumberComponent.prototype), 'elementInfo', this).call(this);
      info.type = 'input';
      info.attr.type = 'number';
      info.changeEvent = 'input';
      if (this.component.validate) {
        if (this.component.validate.min !== '') {
          info.attr.min = this.component.validate.min;
        }
        if (this.component.validate.max !== '') {
          info.attr.max = this.component.validate.max;
        }
        if (this.component.step !== '') {
          info.attr.step = this.component.validate.step;
        }
      }
      return info;
    }
  }, {
    key: 'getValueAt',
    value: function getValueAt(index) {
      if (!this.inputs.length || !this.inputs[index]) {
        return null;
      }
      var val = this.inputs[index].value;
      if (!val) {
        return null;
      }

      if (this.component.validate && this.component.validate.integer) {
        return parseInt(val, 10);
      } else {
        return parseFloat(val);
      }
    }
  }, {
    key: 'setValueAt',
    value: function setValueAt(index, value) {
      if (this.component.validate && this.component.validate.integer) {
        this.inputs[index].value = parseInt(value, 10);
      } else {
        this.inputs[index].value = parseFloat(value);
      }
    }
  }]);

  return NumberComponent;
}(_Base.BaseComponent);