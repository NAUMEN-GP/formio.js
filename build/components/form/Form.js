'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormComponent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _formio = require('../../formio.form');

var _formio2 = _interopRequireDefault(_formio);

var _utils = require('../../utils');

var _utils2 = _interopRequireDefault(_utils);

var _merge2 = require('lodash/merge');

var _merge3 = _interopRequireDefault(_merge2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormComponent = exports.FormComponent = function (_FormioForm) {
  _inherits(FormComponent, _FormioForm);

  function FormComponent(component, options, data) {
    _classCallCheck(this, FormComponent);

    var _this = _possibleConstructorReturn(this, (FormComponent.__proto__ || Object.getPrototypeOf(FormComponent)).call(this, null, options));

    _this.type = 'formcomponent';
    _this.component = component;
    _this.submitted = false;
    _this.data = data;

    // Make sure that if reference is provided, the form must submit.
    if (_this.component.reference) {
      _this.component.submit = true;
    }

    // Build the source based on the root src path.
    if (!component.src && component.path && _this.options.formio) {
      var rootSrc = _this.options.formio.formUrl;
      var parts = rootSrc.split('/');
      parts.pop();
      component.src = parts.join('/') + '/' + component.path;
    }

    // Add the source to this actual submission if the component is a reference.
    if (data[component.key] && _this.component.reference && component.src.indexOf('/submission/') === -1) {
      component.src += '/submission/' + data[component.key]._id;
    }

    // Set the src if the property is provided in the JSON.
    if (component.src) {
      _this.src = component.src;
    }

    // Directly set the submission if it isn't a reference.
    if (data[component.key] && !_this.component.reference) {
      _this.setSubmission(data[component.key]);
    }
    return _this;
  }

  /**
   * Submit the form before the next page is triggered.
   */


  _createClass(FormComponent, [{
    key: 'beforeNext',
    value: function beforeNext() {
      // If we wish to submit the form on next page, then do that here.
      if (this.component.submit) {
        this.submitted = true;
        return this.submit(true);
      } else {
        return _get(FormComponent.prototype.__proto__ || Object.getPrototypeOf(FormComponent.prototype), 'beforeNext', this).call(this);
      }
    }

    /**
     * Submit the form before the whole form is triggered.
     */

  }, {
    key: 'beforeSubmit',
    value: function beforeSubmit() {
      // Before we submit, we need to filter out the references.
      this.data[this.component.key] = this.component.reference ? { _id: this._submission._id } : this._submission;

      // Ensure we submit the form.
      if (this.component.submit && !this.submitted) {
        return this.submit(true);
      } else {
        return _get(FormComponent.prototype.__proto__ || Object.getPrototypeOf(FormComponent.prototype), 'beforeSubmit', this).call(this);
      }
    }
  }, {
    key: 'build',
    value: function build() {
      if (!this.element) {
        this.createElement();
        this.setElement(this.element);
      }

      // Iterate through every component and hide the submit button.
      _utils2.default.eachComponent(this.component.components, function (component) {
        if (component.type === 'button' && component.action === 'submit') {
          component.hidden = true;
        }
      });

      if (!this.data[this.component.key]) {
        this.data[this.component.key] = { data: {} };
      }

      // Add components using the data of the submission.
      this.addComponents(this.element, this.data[this.component.key].data);

      // Set default values.
      var defaultValue = this.defaultValue;
      if (defaultValue) {
        this.setValue(defaultValue);
      }

      // Check conditions for this form.
      this.checkConditions(this.getValue());
    }
  }, {
    key: 'setValue',
    value: function setValue(submission, flags) {
      var _this2 = this;

      flags = this.getFlags.apply(this, arguments);
      if (!submission) {
        this.data[this.component.key] = this._submission = { data: {} };
        return;
      }

      if (submission.data) {
        this._submission = (0, _merge3.default)(this.data[this.component.key], submission);
        return _get(FormComponent.prototype.__proto__ || Object.getPrototypeOf(FormComponent.prototype), 'setValue', this).call(this, submission, flags);
      } else if (submission._id) {
        this.formio.submissionId = submission._id;
        this.formio.submissionUrl = this.formio.submissionsUrl + '/' + submission._id;
        return this.formReady.then(function () {
          _this2._loading = false;
          _this2.loading = true;
          return _this2.formio.loadSubmission().then(function (result) {
            _this2.loading = false;
            return _this2.setValue(result);
          });
        });
      }
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.data[this.component.key];
    }
  }]);

  return FormComponent;
}(_formio2.default);