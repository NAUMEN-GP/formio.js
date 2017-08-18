'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HTMLComponent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Base = require('../base/Base');

var _each2 = require('lodash/each');

var _each3 = _interopRequireDefault(_each2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HTMLComponent = exports.HTMLComponent = function (_BaseComponent) {
  _inherits(HTMLComponent, _BaseComponent);

  function HTMLComponent() {
    _classCallCheck(this, HTMLComponent);

    return _possibleConstructorReturn(this, (HTMLComponent.__proto__ || Object.getPrototypeOf(HTMLComponent)).apply(this, arguments));
  }

  _createClass(HTMLComponent, [{
    key: 'build',
    value: function build() {
      var _this2 = this;

      this.element = this.ce(this.component.tag, {
        class: this.component.className
      });
      (0, _each3.default)(this.component.attrs, function (attr) {
        if (attr.attr) {
          _this2.element.setAttribute(attr.attr, attr.value);
        }
      });
      if (this.component.content) {
        this.element.innerHTML = this.component.content;
      }
    }
  }]);

  return HTMLComponent;
}(_Base.BaseComponent);