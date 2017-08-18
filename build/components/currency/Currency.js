'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CurrencyComponent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vanilla = require('text-mask-all/vanilla');

var _vanilla2 = _interopRequireDefault(_vanilla);

var _createNumberMask = require('text-mask-all/addons/dist/createNumberMask');

var _createNumberMask2 = _interopRequireDefault(_createNumberMask);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _TextField = require('../textfield/TextField');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CurrencyComponent = exports.CurrencyComponent = function (_TextFieldComponent) {
  _inherits(CurrencyComponent, _TextFieldComponent);

  function CurrencyComponent() {
    _classCallCheck(this, CurrencyComponent);

    return _possibleConstructorReturn(this, (CurrencyComponent.__proto__ || Object.getPrototypeOf(CurrencyComponent)).apply(this, arguments));
  }

  _createClass(CurrencyComponent, [{
    key: 'setInputMask',
    value: function setInputMask(input) {
      this.inputMask = (0, _vanilla2.default)({
        inputElement: input,
        mask: (0, _createNumberMask2.default)({
          prefix: '',
          suffix: '',
          thousandsSeparatorSymbol: (0, _get3.default)(this.component, 'thousandsSeparator', ','),
          decimalSymbol: (0, _get3.default)(this.component, 'decimalSymbol', '.'),
          allowNegative: (0, _get3.default)(this.component, 'allowNegative', false),
          allowDecimal: (0, _get3.default)(this.component, 'allowDecimal', true)
        })
      });
    }
  }]);

  return CurrencyComponent;
}(_TextField.TextFieldComponent);