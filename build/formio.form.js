"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormioForm = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _nativePromiseOnly = require("native-promise-only");

var _nativePromiseOnly2 = _interopRequireDefault(_nativePromiseOnly);

var _formio = require("./formio");

var _formio2 = _interopRequireDefault(_formio);

var _Components = require("./components/Components");

var _each2 = require("lodash/each");

var _each3 = _interopRequireDefault(_each2);

var _clone2 = require("lodash/clone");

var _clone3 = _interopRequireDefault(_clone2);

var _assign2 = require("lodash/assign");

var _assign3 = _interopRequireDefault(_assign2);

var _eventemitter = require("eventemitter2");

var _eventemitter2 = _interopRequireDefault(_eventemitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Initialize the available forms.
_formio2.default.forms = {};

/**
 * Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
 *
 * This is needed for PhantomJS.
 */
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function fNOP() {},
        fBound = function fBound() {
      return fToBind.apply(this instanceof fNOP ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
    };

    if (this.prototype) {
      // Function.prototype doesn't have a prototype property
      fNOP.prototype = this.prototype;
    }
    fBound.prototype = new fNOP();

    return fBound;
  };
}

var getOptions = function getOptions(options) {
  options = options || {};
  if (!options.events) {
    options.events = new _eventemitter2.default({
      wildcard: false,
      maxListeners: 0
    });
  }
  return options;
};

/**
 * Renders a Form.io form within the webpage.
 *
 * @example
 * import FormioForm from 'formiojs/form';
 * let form = new FormioForm(document.getElementById('formio'));
 * form.src = 'https://examples.form.io/example';
 */

var FormioForm = exports.FormioForm = function (_FormioComponents) {
  _inherits(FormioForm, _FormioComponents);

  /**
   * Creates a new FormioForm instance.
   *
   * @param {Object} element - The DOM element you wish to render this form within.
   * @param {Object} options - The options to create a new form instance.
   * @param {boolean} options.readOnly - Set this form to readOnly
   * @param {boolean} options.noAlerts - Set to true to disable the alerts dialog.
   * @param {boolean} options.i18n - The translation file for this rendering. @see https://github.com/formio/formio.js/blob/master/i18n.js
   * @param {boolean} options.template - Provides a way to inject custom logic into the creation of every element rendered within the form.
   *
   * @example
   * import FormioForm from 'formiojs/form';
   * let form = new FormioForm(document.getElementById('formio'), {
   *   readOnly: true
   * });
   * form.src = 'https://examples.form.io/example';
   *
   */
  function FormioForm(element, options) {
    _classCallCheck(this, FormioForm);

    // Keep track of all available forms globally.
    var _this = _possibleConstructorReturn(this, (FormioForm.__proto__ || Object.getPrototypeOf(FormioForm)).call(this, null, getOptions(options)));

    _formio2.default.forms[_this.id] = _this;

    /**
     * The type of this element.
     * @type {string}
     */
    _this.type = 'form';
    _this._src = '';
    _this._loading = false;
    _this._submission = {};
    _this._form = null;

    /**
     * Determines if this form should submit the API on submit.
     * @type {boolean}
     */
    _this.nosubmit = false;

    /**
     * The Formio instance for this form.
     * @type {Formio}
     */
    _this.formio = null;

    /**
     * The loader HTML element.
     * @type {HTMLElement}
     */
    _this.loader = null;

    /**
     * The alert HTML element
     * @type {HTMLElement}
     */
    _this.alert = null;

    /**
     * Promise that is triggered when the submission is done loading.
     * @type {Promise}
     */
    _this.onSubmission = null;

    /**
     * Promise that is triggered when the form is done building.
     * @type {Promise}
     */
    _this.onFormBuild = null;

    /**
     * Promise that executes when the form is ready and rendered.
     * @type {Promise}
     *
     * @example
     * let form = new FormioForm(document.getElementById('formio'));
     * form.ready.then(() => {
     *   console.log('The form is ready!');
     * });
     * form.src = 'https://examples.form.io/example';
     */
    _this.formReady = new _nativePromiseOnly2.default(function (resolve, reject) {
      /**
       * Called when the formReady state of this form has been resolved.
       *
       * @type {function}
       */
      _this.formReadyResolve = resolve;

      /**
       * Called when this form could not load and is rejected.
       *
       * @type {function}
       */
      _this.formReadyReject = reject;
    });

    /**
     * Promise that executes when the submission is ready and rendered.
     * @type {Promise}
     *
     * @example
     * let form = new FormioForm(document.getElementById('formio'));
     * form.ready.then(() => {
     *   console.log('The form is ready!');
     * });
     * form.src = 'https://examples.form.io/example';
     */
    _this.submissionReady = new _nativePromiseOnly2.default(function (resolve, reject) {
      /**
       * Called when the formReady state of this form has been resolved.
       *
       * @type {function}
       */
      _this.submissionReadyResolve = resolve;

      /**
       * Called when this form could not load and is rejected.
       *
       * @type {function}
       */
      _this.submissionReadyReject = reject;
    });

    /**
     * Promise to trigger when the element for this form is established.
     *
     * @type {Promise}
     */
    _this.onElement = new _nativePromiseOnly2.default(function (resolve) {
      /**
       * Called when the element has been resolved.
       *
       * @type {function}
       */
      _this.elementResolve = resolve;
      _this.setElement(element);
    });
    return _this;
  }

  /**
   * Sets the the outside wrapper element of the Form.
   *
   * @param {HTMLElement} element - The element to set as the outside wrapper element for this form.
   */


  _createClass(FormioForm, [{
    key: "setElement",
    value: function setElement(element) {
      var _this2 = this;

      if (!element) {
        return;
      }

      this.element = element;
      var classNames = this.element.getAttribute('class');
      classNames += ' formio-form';
      this.addClass(this.element, classNames);
      this.loading = true;
      this.ready.then(function () {
        return _this2.loading = false;
      }, function () {
        return _this2.loading = false;
      }).catch(function () {
        return _this2.loading = false;
      });
      this.elementResolve(element);
    }

    /**
     * Get the embed source of the form.
     *
     * @returns {string}
     */

  }, {
    key: "loadSubmission",


    /**
     * Loads the submission if applicable.
     */
    value: function loadSubmission() {
      var _this3 = this;

      if (this.formio.submissionId) {
        this.onSubmission = this.formio.loadSubmission().then(function (submission) {
          return _this3.setSubmission(submission);
        }, function (err) {
          return _this3.submissionReadyReject(err);
        }).catch(function (err) {
          return _this3.submissionReadyReject(err);
        });
      }
    }

    /**
     * Set the Form source, which is typically the Form.io embed URL.
     *
     * @param {string} value - The value of the form embed url.
     *
     * @example
     * let form = new FormioForm(document.getElementById('formio'));
     * form.formReady.then(() => {
     *   console.log('The form is formReady!');
     * });
     * form.src = 'https://examples.form.io/example';
     */

  }, {
    key: "setForm",


    /**
     * Sets the JSON schema for the form to be rendered.
     *
     * @example
     * let form = new FormioForm(document.getElementById('formio'));
     * form.setForm({
     *   components: [
     *     {
     *       type: 'textfield',
     *       key: 'firstName',
     *       label: 'First Name',
     *       placeholder: 'Enter your first name.',
     *       input: true
     *     },
     *     {
     *       type: 'textfield',
     *       key: 'lastName',
     *       label: 'Last Name',
     *       placeholder: 'Enter your last name',
     *       input: true
     *     },
     *     {
     *       type: 'button',
     *       action: 'submit',
     *       label: 'Submit',
     *       theme: 'primary'
     *     }
     *   ]
     * });
     *
     * @param {Object} form - The JSON schema of the form @see https://examples.form.io/example for an example JSON schema.
     * @returns {*}
     */
    value: function setForm(form) {
      var _this4 = this;

      if (form.display === 'wizard') {
        console.warn('You need to instantiate the FormioWizard class to use this form as a wizard.');
      }

      if (this.onFormBuild) {
        return this.onFormBuild.then(function () {
          return _this4.createForm(form);
        }, function (err) {
          return _this4.formReadyReject(err);
        }).catch(function (err) {
          return _this4.formReadyReject(err);
        });
      }

      // Set the form object.
      this._form = form;
      this.emit('formLoad', form);

      // Create the form.
      return this.createForm(form);
    }

    /**
     * Gets the form object.
     *
     * @returns {Object} - The form JSON schema.
     */

  }, {
    key: "setSubmission",


    /**
     * Sets a submission and returns the promise when it is ready.
     * @param submission
     * @return {Promise.<TResult>}
     */
    value: function setSubmission(submission) {
      var _this5 = this;

      return this.onSubmission = this.formReady.then(function () {
        var virginSubmission = Object.assign({}, submission);
        _this5.setValue(submission);
        _this5.submissionReadyResolve(virginSubmission);
      }, function (err) {
        return _this5.submissionReadyReject(err);
      }).catch(function (err) {
        return _this5.submissionReadyReject(err);
      });
    }
  }, {
    key: "setValue",
    value: function setValue(submission, flags) {
      this._submission = submission || { data: {} };
      return _get(FormioForm.prototype.__proto__ || Object.getPrototypeOf(FormioForm.prototype), "setValue", this).call(this, this._submission.data, flags);
    }
  }, {
    key: "getValue",
    value: function getValue() {
      if (!this._submission.data) {
        this._submission.data = {};
      }
      this._submission.data = (0, _assign3.default)(this.data, _get(FormioForm.prototype.__proto__ || Object.getPrototypeOf(FormioForm.prototype), "getValue", this).call(this));
      return this._submission;
    }

    /**
     * Create a new form.
     *
     * @param {Object} form - The form object that is created.
     * @returns {Promise.<TResult>}
     */

  }, {
    key: "createForm",
    value: function createForm(form) {
      var _this6 = this;

      /**
       * {@link BaseComponent.component}
       */
      if (this.component) {
        this.component.components = form.components;
      } else {
        this.component = form;
      }
      return this.onFormBuild = this.render().then(function () {
        _this6.formReadyResolve();
        _this6.onFormBuild = null;
        _this6.setSubmission(_this6._submission);
      }, function (err) {
        return _this6.formReadyReject(err);
      }).catch(function (err) {
        return _this6.formReadyReject(err);
      });
    }

    /**
     * Render the form within the HTML element.
     * @returns {Promise.<TResult>}
     */

  }, {
    key: "render",
    value: function render() {
      var _this7 = this;

      return this.onElement.then(function () {
        _this7.clear();
        return _this7.localize().then(function () {
          _this7.build();
          _this7.on('resetForm', function () {
            return _this7.reset();
          }, true);
          _this7.on('componentChange', function (changed) {
            return _this7.onSubmissionChange(changed);
          }, true);
          _this7.on('refreshData', function () {
            return _this7.updateValue();
          });
          _this7.emit('render');
        });
      });
    }

    /**
     * Sets a new alert to display in the error dialog of the form.
     *
     * @param {string} type - The type of alert to display. "danger", "success", "warning", etc.
     * @param {string} message - The message to show in the alert.
     */

  }, {
    key: "setAlert",
    value: function setAlert(type, message) {
      if (this.options.noAlerts) {
        if (!message) {
          this.emit('error', false);
        }
        return;
      }
      if (this.alert) {
        try {
          this.removeChild(this.alert);
          this.alert = null;
        } catch (err) {}
      }
      if (message) {
        this.alert = this.ce('div', {
          class: 'alert alert-' + type,
          role: 'alert'
        });
        this.alert.innerHTML = message;
      }
      if (!this.alert) {
        return;
      }
      this.prepend(this.alert);
    }

    /**
     * Build the form.
     */

  }, {
    key: "build",
    value: function build() {
      var _this8 = this;

      this.on('submitButton', function () {
        return _this8.submit();
      }, true);
      this.addComponents();
      this.checkConditions(this.getValue());
    }

    /**
     * Show the errors of this form within the alert dialog.
     *
     * @param {Object} errors - An optional additional errors to display along with the component errors.
     * @returns {*}
     */

  }, {
    key: "showErrors",
    value: function showErrors(errors) {
      var _this9 = this;

      this.loading = false;
      var mergedErrors = this.errors;
      var customMessage = this.t('error');
      if (errors) {
        (0, _each3.default)(errors, function (err) {
          if (err.key) {
            var comp = _this9.getComponent(err.key);
            if (comp) {
              comp.setCustomValidity(err.message, true);
              mergedErrors.push({
                component: comp,
                message: err.message
              });
            } else {
              customMessage = err.message;
            }
          } else {
            customMessage = err.message;
          }
        });
      }
      if (!mergedErrors.length) {
        this.setAlert(false);
        return;
      }

      this.setAlert('danger', '<p>' + customMessage + '</p>');
      this.emit('error', mergedErrors);
      return mergedErrors;
    }

    /**
     * Called when the submission has completed, or if the submission needs to be sent to an external library.
     *
     * @param {Object} submission - The submission object.
     * @param {boolean} saved - Whether or not this submission was saved to the server.
     * @returns {object} - The submission object.
     */

  }, {
    key: "onSubmit",
    value: function onSubmit(submission, saved) {
      this.loading = false;
      this.setValue(submission);
      this.setAlert('success', '<p>' + this.t('complete') + '</p>');
      this.emit('submit', submission);
      if (saved) {
        this.emit('submitDone', submission);
      }
      return submission;
    }

    /**
     * Called when an errors occurs during the submission.
     *
     * @param {Object} errors - The errors that occured.
     */

  }, {
    key: "onSubmissionError",
    value: function onSubmissionError(errors) {
      if (!errors) {
        return;
      }

      // Normalize the errors.
      if (typeof errors === 'string') {
        errors = [{ message: errors }];
      } else if ((typeof errors === "undefined" ? "undefined" : _typeof(errors)) === 'object' && !Array.isArray(errors)) {
        errors = [errors];
      }

      this.showErrors(errors);
    }

    /**
     * Called when the submission has changed in value.
     *
     * @param {Object} changed - The changed value that triggered this event.
     * @param {Object} changed.component - The component that was changed.
     * @param {*} changed.value - The new value of the changed component.
     * @param {boolean} changed.flags - The flags to apply to this update.
     */

  }, {
    key: "onSubmissionChange",
    value: function onSubmissionChange(changed) {
      this._submission = this.submission;
      var value = (0, _clone3.default)(this._submission);
      value.changed = changed;
      this.checkData(value.data, changed.flags);
      this.emit('change', value);
    }

    /**
     * Resets the submission of a form and restores defaults.
     *
     * @example
     * let form = new FormioForm(document.getElementById('formio'));
     * form.src = 'https://examples.form.io/example';
     * form.submission = {data: {
     *   firstName: 'Joe',
     *   lastName: 'Smith',
     *   email: 'joe@example.com'
     * }};
     *
     * // In two seconds, reset the data in the form.
     * setTimeout(() => form.reset(), 2000);
     */

  }, {
    key: "reset",
    value: function reset() {
      // Reset the submission data.
      this.data = this.value = {};
      this.setSubmission({ data: {} });
    }

    /**
     * Cancels the submission.
     *
     * @alias reset
     */

  }, {
    key: "cancel",
    value: function cancel() {
      this.reset();
    }
  }, {
    key: "executeSubmit",
    value: function executeSubmit() {
      var _this10 = this;

      var submission = this.submission;
      if (submission && submission.data && this.checkValidity(submission.data, true)) {
        this.loading = true;
        if (this.nosubmit || !this.formio) {
          return this.onSubmit(submission, false);
        }
        return this.formio.saveSubmission(submission).then(function (result) {
          return _this10.onSubmit(result, true);
        }, function (err) {
          return _this10.onSubmissionError(err);
        }).catch(function (err) {
          return _this10.onSubmissionError(err);
        });
      } else {
        this.showErrors();
        return _nativePromiseOnly2.default.reject('Invalid Submission');
      }
    }

    /**
     * Submits the form.
     *
     * @example
     * let form = new FormioForm(document.getElementById('formio'));
     * form.src = 'https://examples.form.io/example';
     * form.submission = {data: {
     *   firstName: 'Joe',
     *   lastName: 'Smith',
     *   email: 'joe@example.com'
     * }};
     * form.submit().then((submission) => {
     *   console.log(submission);
     * });
     *
     * @param {boolean} before - If this submission occured from the before handlers.
     *
     * @returns {Promise} - A promise when the form is done submitting.
     */

  }, {
    key: "submit",
    value: function submit(before) {
      var _this11 = this;

      if (!before) {
        return this.beforeSubmit().then(function () {
          return _this11.executeSubmit();
        });
      } else {
        return this.executeSubmit();
      }
    }
  }, {
    key: "src",
    get: function get() {
      return this._src;
    },
    set: function set(value) {
      var _this12 = this;

      this.url = value;
      this.nosubmit = false;
      this.formio.loadForm().then(function (form) {
        var setForm = _this12.setForm(form);
        _this12.loadSubmission();
        return setForm;
      }, function (err) {
        return _this12.formReadyReject(err);
      }).catch(function (err) {
        return _this12.formReadyReject(err);
      });
    }

    /**
     * Get the embed source of the form.
     *
     * @returns {string}
     */

  }, {
    key: "url",
    get: function get() {
      return this._src;
    }

    /**
     * Set the form source but don't initialize the form and submission from the url.
     *
     * @param {string} value - The value of the form embed url.
     */
    ,
    set: function set(value) {
      if (!value || typeof value !== 'string') {
        return;
      }
      this._src = value;
      this.nosubmit = true;
      this.formio = this.options.formio = new _formio2.default(value);

      if (this.type === 'form') {
        // Set the options source so this can be passed to other components.
        this.options.src = value;
      }
    }

    /**
     * Called when both the form and submission have been loaded.
     *
     * @returns {Promise} - The promise to trigger when both form and submission have loaded.
     */

  }, {
    key: "ready",
    get: function get() {
      var _this13 = this;

      return this.formReady.then(function () {
        return _this13.submissionReady;
      });
    }

    /**
     * Returns if this form is loading.
     *
     * @returns {boolean} - TRUE means the form is loading, FALSE otherwise.
     */

  }, {
    key: "loading",
    get: function get() {
      return this._loading;
    }

    /**
     * Set the loading state for this form, and also show the loader spinner.
     *
     * @param {boolean} loading - If this form should be "loading" or not.
     */
    ,
    set: function set(loading) {
      if (this._loading !== loading) {
        this._loading = loading;
        if (!this.loader && loading) {
          this.loader = this.ce('div', {
            class: 'loader-wrapper'
          });
          var spinner = this.ce('div', {
            class: 'loader text-center'
          });
          this.loader.appendChild(spinner);
        }
        if (this.loader) {
          try {
            if (loading) {
              this.prepend(this.loader);
            } else {
              this.removeChild(this.loader);
            }
          } catch (err) {}
        }
      }
    }
  }, {
    key: "form",
    get: function get() {
      return this._form;
    }

    /**
     * Sets the form value.
     *
     * @alias setForm
     * @param {Object} form - The form schema object.
     */
    ,
    set: function set(form) {
      this.setForm(form);
    }

    /**
     * Returns the submission object that was set within this form.
     *
     * @returns {Object}
     */

  }, {
    key: "submission",
    get: function get() {
      return this.getValue();
    }

    /**
     * Sets the submission of a form.
     *
     * @example
     * let form = new FormioForm(document.getElementById('formio'));
     * form.src = 'https://examples.form.io/example';
     * form.submission = {data: {
     *   firstName: 'Joe',
     *   lastName: 'Smith',
     *   email: 'joe@example.com'
     * }};
     *
     * @param {Object} submission - The Form.io submission object.
     */
    ,
    set: function set(submission) {
      this.setSubmission(submission);
    }
  }]);

  return FormioForm;
}(_Components.FormioComponents);

FormioForm.setBaseUrl = _formio2.default.setBaseUrl;
FormioForm.setApiUrl = _formio2.default.setApiUrl;
FormioForm.setAppUrl = _formio2.default.setAppUrl;
module.exports = global.FormioForm = FormioForm;