'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextFieldComponent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Base = require('../base/Base');

var _each2 = require('lodash/each');

var _each3 = _interopRequireDefault(_each2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextFieldComponent = exports.TextFieldComponent = function (_BaseComponent) {
  _inherits(TextFieldComponent, _BaseComponent);

  function TextFieldComponent() {
    _classCallCheck(this, TextFieldComponent);

    return _possibleConstructorReturn(this, (TextFieldComponent.__proto__ || Object.getPrototypeOf(TextFieldComponent)).apply(this, arguments));
  }

  _createClass(TextFieldComponent, [{
    key: 'elementInfo',
    value: function elementInfo() {
      var info = _get(TextFieldComponent.prototype.__proto__ || Object.getPrototypeOf(TextFieldComponent.prototype), 'elementInfo', this).call(this);
      info.type = 'input';
      info.attr.type = 'text';
      info.changeEvent = 'input';
      return info;
    }
  }, {
    key: 'isEmpty',
    value: function isEmpty(value) {
      if (this.validateMultiple(value)) {
        var result = false;
        if (value == null || value.length === 0) {
          result = true;
        }
        (0, _each3.default)(value, function (val) {
          if (val == null || val.length === 0) {
            result = true;
          }
        });
        return result;
      } else {
        return value == null || value.length === 0;
      }
    }
  }, {
    key: 'createHint',
    value: function createHint(container) {
      if (!(this.component.validate && this.component.validate.maxLength)) {
        return;
      }

      var leftCharsHint = this.ce('div', { class: 'edit-hint' });
      var beforeWord = this.ce('span', { class: 'before-word' });
      leftCharsHint.appendChild(beforeWord);
      var leftCharacters = this.ce('span', { class: 'left-characters' });
      leftCharsHint.appendChild(leftCharacters);
      var afterWord = this.ce('span', { class: 'after-word' });
      leftCharsHint.appendChild(afterWord);

      var limit = this.component.validate.maxLength;
      var me = this;

      var beforeWords = ['left1', 'left2', 'left3'];
      var afterWords = ['char1', 'char2', 'char3'];

      function updateCountInfo() {
        var value = void 0;
        if (me.component.wysiwyg) {
          value = me.htmlToPlainText(me.getValue());
        } else {
          value = me.getValue();
        }
        var length = value ? value.length : 0;
        var left = limit - length;
        leftCharacters.innerHTML = left.toString();
        beforeWord.innerHTML = me.t(me.decOfNum(Math.abs(left), beforeWords)) + '&nbsp;';
        afterWord.innerHTML = '&nbsp;' + me.t(me.decOfNum(Math.abs(left), afterWords));

        var containsColorRed = leftCharacters.classList.contains('color-red');
        if (length > limit) {
          if (!containsColorRed) {
            me.addClass(leftCharacters, 'color-red');
          }
        } else if (containsColorRed) {
          me.removeClass(leftCharacters, 'color-red');
        }
      }

      /*let interval;
      this.addEventListener(input, 'focus', function(){
          interval = setInterval(updateCountInfo, 100);
      });
      this.addEventListener(input, 'blur', function(){
          clearInterval(interval);
      });*/

      this.errorContainer.appendChild(leftCharsHint);
      this.on('componentChange', updateCountInfo, true);
    }
  }]);

  return TextFieldComponent;
}(_Base.BaseComponent);