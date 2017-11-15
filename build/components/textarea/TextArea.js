'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextAreaComponent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _TextField = require('../textfield/TextField');

var _Base = require('../base/Base');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextAreaComponent = exports.TextAreaComponent = function (_TextFieldComponent) {
  _inherits(TextAreaComponent, _TextFieldComponent);

  function TextAreaComponent() {
    _classCallCheck(this, TextAreaComponent);

    return _possibleConstructorReturn(this, (TextAreaComponent.__proto__ || Object.getPrototypeOf(TextAreaComponent)).apply(this, arguments));
  }

  _createClass(TextAreaComponent, [{
    key: 'wysiwygDefault',
    value: function wysiwygDefault() {
      return {
        toolbarGroups: [{ name: 'basicstyles', groups: ['basicstyles', 'cleanup'] }, { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] }, { name: 'links', groups: ['links'] }, { name: 'insert', groups: ['insert'] }, '/', { name: 'styles', groups: ['Styles', 'Format', 'Font', 'FontSize'] }, { name: 'colors', groups: ['colors'] }, { name: 'clipboard', groups: ['clipboard', 'undo'] }, { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] }, { name: 'document', groups: ['mode', 'document', 'doctools'] }, { name: 'others', groups: ['others'] }, { name: 'tools', groups: ['tools'] }],
        extraPlugins: 'justify,font',
        removeButtons: 'Cut,Copy,Paste,Underline,Subscript,Superscript,Scayt,About',
        uiColor: '#eeeeee',
        height: '400px',
        width: '100%'
      };
    }
  }, {
    key: 'createInput',
    value: function createInput(container) {
      var t = this;
      if (!this.component.wysiwyg) {
        return _get(TextAreaComponent.prototype.__proto__ || Object.getPrototypeOf(TextAreaComponent.prototype), 'createInput', this).call(this, container);
      }

      if (typeof this.component.wysiwyg === 'boolean') {
        this.component.wysiwyg = this.wysiwygDefault();
      }

      // Add the input.
      this.input = this.ce('textarea', {
        class: 'form-control'
      });
      container.appendChild(this.input);

      var settings = this.component.wysiwyg;

      if (this.options.readOnly || this.component.disabled) {
        settings.readOnly = true;
      }

      this.ckEditorInstance = CKEDITOR.replace(this.input, settings);
      this.ckEditorInstance.on('change', function (e) {
        t.updateValue(true);
      });
      this.ckEditorInstance.setData(this.data[this.component.key]);
      return this.input;
    }
  }, {
    key: 'setValue',
    value: function setValue(value, flags) {
      if (!this.component.wysiwyg) {
        return _get(TextAreaComponent.prototype.__proto__ || Object.getPrototypeOf(TextAreaComponent.prototype), 'setValue', this).call(this, value, flags);
      }
      this.ckEditorInstance.setData(value);
      this.updateValue(flags);
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      if (!this.component.wysiwyg) {
        return _get(TextAreaComponent.prototype.__proto__ || Object.getPrototypeOf(TextAreaComponent.prototype), 'getValue', this).call(this);
      }

      if (this.ckEditorInstance) {
        return this.ckEditorInstance.getData();
      }
    }
  }, {
    key: 'elementInfo',
    value: function elementInfo() {
      var info = _get(TextAreaComponent.prototype.__proto__ || Object.getPrototypeOf(TextAreaComponent.prototype), 'elementInfo', this).call(this);
      info.type = 'textarea';
      if (this.component.rows) {
        info.attr.rows = this.component.rows;
      }
      return info;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.ckEditorInstance) {
        this.ckEditorInstance.removeAllListeners();
        CKEDITOR.remove(this.ckEditorInstance);
        delete this.ckEditorInstance;
      }
    }
  }]);

  return TextAreaComponent;
}(_TextField.TextFieldComponent);