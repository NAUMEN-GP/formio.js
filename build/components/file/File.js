'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileComponent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Base = require('../base/Base');

var _utils = require('../../utils');

var _utils2 = _interopRequireDefault(_utils);

var _formio = require('../../formio');

var _formio2 = _interopRequireDefault(_formio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FileComponent = exports.FileComponent = function (_BaseComponent) {
  _inherits(FileComponent, _BaseComponent);

  function FileComponent(component, options, data) {
    _classCallCheck(this, FileComponent);

    var _this = _possibleConstructorReturn(this, (FileComponent.__proto__ || Object.getPrototypeOf(FileComponent)).call(this, component, options, data));

    _this.support = {
      filereader: typeof FileReader != 'undefined',
      dnd: 'draggable' in document.createElement('span'),
      formdata: !!window.FormData,
      progress: "upload" in new XMLHttpRequest()
    };
    _this.extToMime = {
      txt: "text/plain",
      jpg: "image/jpeg",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ods: "application/vnd.oasis.opendocument.spreadsheet",
      odt: "application/vnd.oasis.opendocument.text",
      odp: "application/vnd.oasis.opendocument.presentation"
    };
    return _this;
  }

  _createClass(FileComponent, [{
    key: 'getValue',
    value: function getValue() {
      return this.data[this.component.key];
    }
  }, {
    key: 'setValue',
    value: function setValue(value) {
      this.data[this.component.key] = value || [];
      this.refreshDOM();
    }
  }, {
    key: 'build',
    value: function build() {
      // Set default to empty array.
      if (!this.getValue()) {
        this.setValue([]);
      }
      this.createElement();
      this.createLabel(this.element);
      this.createDescription(this.element);
      this.listContainer = this.buildList();
      this.element.appendChild(this.listContainer);
      this.uploadContainer = this.buildUpload();
      this.element.appendChild(this.uploadContainer);
      this.addWarnings(this.element);
      this.buildUploadStatusList(this.element);
      this.errorContainer = this.ce('div', { class: 'error-container' });
      this.element.appendChild(this.errorContainer);
      this.createErrorElement();
    }
  }, {
    key: 'refreshDOM',
    value: function refreshDOM() {
      // Don't refresh before the initial render.
      if (this.listContainer && this.uploadContainer) {
        // Refresh file list.
        var newList = this.buildList();
        this.element.replaceChild(newList, this.listContainer);
        this.listContainer = newList;

        // Refresh upload container.
        var newUpload = this.buildUpload();
        this.element.replaceChild(newUpload, this.uploadContainer);
        this.uploadContainer = newUpload;
      }
    }
  }, {
    key: 'buildList',
    value: function buildList() {
      if (this.component.image) {
        return this.buildImageList();
      } else {
        return this.buildFileList();
      }
    }
  }, {
    key: 'buildFileList',
    value: function buildFileList() {
      var _this2 = this;

      return this.ce('ul', { class: 'list-group list-group-striped' }, [this.data[this.component.key].map(function (fileInfo, index) {
        return _this2.createFileListItem(fileInfo, index);
      })]);
    }
  }, {
    key: 'createFileListItem',
    value: function createFileListItem(fileInfo, index) {
      var _this3 = this;

      var removeIcon = !this.disabled ? this.ce('span', {
        class: 'btn-delete ml-15 action',
        onClick: function onClick(event) {
          if (_this3.component.storage === 'url') {
            _this3.options.formio.makeRequest('', _this3.data[_this3.component.key][index].url, 'delete');
          }
          event.preventDefault();
          _this3.data[_this3.component.key].splice(index, 1);
          _this3.refreshDOM();
          _this3.triggerChange();
        }
      }, this.ce('span', { class: 'glyphicon glyphicon-trash' })) : null;

      return this.ce('li', { class: 'list-group-item' }, this.ce('div', { class: 'mt-5' }, [this.createFileLink(fileInfo.data), removeIcon]));
    }
  }, {
    key: 'createFileIcon',
    value: function createFileIcon(filename) {
      var ext = filename.split('.').pop();
      var icon = 'document.svg';
      switch (ext) {
        case 'doc':
        case 'dot':
        case 'docx':
          icon = 'word.png';
          break;
        case 'xls':
        case 'xlt':
        case 'xlsx':
          icon = 'excel.png';
          break;
        case 'ppt':
        case 'pptx':
        case 'ppsx':
          icon = 'ppoint.png';
          break;
        case 'pdf':
          icon = 'pdf.png';
          break;
        default:
      }

      return this.ce('img', { src: 'assets/ui/assets/images/formio/' + icon });
    }
  }, {
    key: 'createFileLink',
    value: function createFileLink(file) {
      return this.ce('a', {
        href: file.url, target: '_blank',
        onClick: this.getFile.bind(this, file)
      }, [this.createFileIcon(file.name), file.name]);
    }
  }, {
    key: 'buildImageList',
    value: function buildImageList() {
      var _this4 = this;

      return this.ce('div', {}, this.data[this.component.key].map(function (fileInfo, index) {
        return _this4.createImageListItem(fileInfo.data, index);
      }));
    }
  }, {
    key: 'createImageListItem',
    value: function createImageListItem(fileInfo, index) {
      var _this5 = this;

      var image = void 0;

      var fileService = this.fileService;
      if (fileService) {
        fileService.downloadFile(fileInfo).then(function (result) {
          image.src = result.url;
        });
      }
      return this.ce('div', {}, this.ce('span', {}, [image = this.ce('img', { src: '', alt: fileInfo.name, style: 'width:' + this.component.imageSize + 'px', onClick: function onClick(event) {
          _this5.emit('imageClick', fileInfo);
        } }), !this.disabled ? this.ce('span', {
        class: 'glyphicon glyphicon-trash',
        style: 'font-size: 14px; cursor: pointer; margin-left: 15px;',
        onClick: function onClick(event) {
          if (_this5.component.storage === 'url') {
            _this5.options.formio.makeRequest('', _this5.data[_this5.component.key][index].url, 'delete');
          }
          event.preventDefault();
          _this5.data[_this5.component.key].splice(index, 1);
          _this5.refreshDOM();
          _this5.triggerChange();
        }
      }) : null]));
    }
  }, {
    key: 'buildUpload',
    value: function buildUpload() {
      var _this6 = this;

      // Drop event must change this pointer so need a reference to parent this.
      var element = this;
      // If this is disabled or a single value with a value, don't show the upload div.
      return this.ce('div', {}, !this.disabled && (this.component.multiple || this.data[this.component.key].length === 0) ? this.ce('div', {
        class: 'fileSelector',
        onDragover: function onDragover(event) {
          this.className = 'fileSelector fileDragOver';
          event.preventDefault();
        },
        onDragleave: function onDragleave(event) {
          this.className = 'fileSelector';
          event.preventDefault();
        },
        onDrop: function onDrop(event) {
          this.className = 'fileSelector';
          event.preventDefault();
          element.upload(event.dataTransfer.files);
          return false;
        }
      }, [this.ce('i', { class: 'glyphicon glyphicon-cloud-upload' }), this.text(' Drop files to attach, or '), this.ce('a', {
        onClick: function onClick(event) {
          event.preventDefault();
          // There is no direct way to trigger a file dialog. To work around this, create an input of type file and trigger
          // a click event on it.
          var props = { type: 'file', onChange: function onChange() {
              _this6.upload(input.files);
            } };
          if (_this6.component.accept) {
            props.accept = _this6.component.accept;
          }
          var input = _this6.ce('input', props);
          // Trigger a click event on the input.
          if (typeof input.trigger === 'function') {
            input.trigger('click');
          } else {
            input.click();
          }
        }
      }, 'browse')]) : this.ce('div'));
    }
  }, {
    key: 'buildUploadStatusList',
    value: function buildUploadStatusList(container) {
      var list = this.ce('div');
      this.uploadStatusList = list;
      container.appendChild(list);
    }
  }, {
    key: 'addWarnings',
    value: function addWarnings(container) {
      var hasWarnings = false;
      var warnings = this.ce('div', { class: 'alert alert-warning' });
      if (!this.component.storage) {
        hasWarnings = true;
        warnings.appendChild(this.ce('p').appendChild(this.text('No storage has been set for this field. File uploads are disabled until storage is set up.')));
      }
      if (!this.support.dnd) {
        hasWarnings = true;
        warnings.appendChild(this.ce('p').appendChild(this.text('FFile Drag/Drop is not supported for this browser.')));
      }
      if (!this.support.filereader) {
        hasWarnings = true;
        warnings.appendChild(this.ce('p').appendChild(this.text('File API & FileReader API not supported.')));
      }
      if (!this.support.formdata) {
        hasWarnings = true;
        warnings.appendChild(this.ce('p').appendChild(this.text('XHR2\'s FormData is not supported.')));
      }
      if (!this.support.progress) {
        hasWarnings = true;
        warnings.appendChild(this.ce('p').appendChild(this.text('XHR2\'s upload progress isn\'t supported.')));
      }
      if (hasWarnings) {
        container.appendChild(warnings);
      }
    }
  }, {
    key: 'fileSize',
    value: function fileSize(a, b, c, d, e) {
      return (b = Math, c = b.log, d = 1024, e = c(a) / c(d) | 0, a / b.pow(d, e)).toFixed(2) + ' ' + (e ? 'kMGTPEZY'[--e] + 'B' : 'Bytes');
    }
  }, {
    key: 'createUploadStatus',
    value: function createUploadStatus(fileUpload) {
      var _this7 = this;

      var container = void 0;
      return container = this.ce('div', { class: 'file' + (fileUpload.status === 'error' ? ' has-error' : '') }, [this.ce('div', { class: 'row' }, [this.ce('div', { class: 'fileName control-label col-sm-10' }, [fileUpload.name, this.ce('span', {
        class: 'glyphicon glyphicon-trash',
        style: 'font-size: 14px; cursor: pointer; margin-left: 15px;',
        onClick: function onClick() {
          _this7.uploadStatusList.removeChild(container);
        }
      })]), this.ce('div', { class: 'fileSize control-label col-sm-2 text-right' }, this.fileSize(fileUpload.size))]), this.ce('div', { class: 'row' }, [this.ce('div', { class: 'col-sm-12' }, [fileUpload.status === 'progress' ? this.ce('div', { class: 'progress' }, this.ce('div', {
        class: 'progress-bar',
        role: 'progressbar',
        'aria-valuenow': fileUpload.progress,
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        style: 'width:' + fileUpload.progress + '%'
      }, this.ce('span', { class: 'sr-only' }, fileUpload.progress + '% Complete'))) : this.ce('div', { class: 'bg-' + fileUpload.status }, this.t(fileUpload.message))])])]);
    }
  }, {
    key: 'upload',
    value: function upload(files) {
      var _this8 = this;

      // Only allow one upload if not multiple.
      if (!this.component.multiple) {
        files = Array.prototype.slice.call(files, 0, 1);
      } else if (this.component.maxCount) {
        var count = this.getValue() && this.getValue() instanceof Array ? this.getValue().length : 0;
        var leftCount = this.component.maxCount - count;
        if (leftCount <= 0) {
          files = [];
        } else if (leftCount < files.length) {
          files = Array.prototype.slice.call(files, 0, leftCount);
        }
      }
      if (this.component.storage && files && files.length) {
        // files is not really an array and does not have a forEach method, so fake it.
        Array.prototype.forEach.call(files, function (file) {
          // Get a unique name for this file to keep file collisions from occurring.
          var fileName = _utils2.default.uniqueName(file.name);
          var fileUpload = {
            name: file.name,
            size: file.size,
            status: 'info',
            message: 'Starting upload'
          };
          var dir = _this8.interpolate(_this8.component.dir || '', { data: _this8.data, row: _this8.row });
          var fileService = _this8.fileService;
          if (!fileService) {
            fileUpload.status = 'error';
            fileUpload.message = 'File Service not provided.';
          }

          var invalidExtension = false;

          if (_this8.component.accept) {
            var acceptExts = _this8.component.accept.split(",").map(function (ext) {
              return ext.trim().toLowerCase();
            });
            var acceptTypes = acceptExts.map(function (ext) {
              var mime = this.extToMime[ext];
              return mime ? mime : ext;
            }, _this8);

            if (file.type) {
              if (acceptTypes.findIndex(function (ext) {
                return file.type.indexOf(ext) >= 0;
              }) < 0) {
                invalidExtension = true;
              }
            } else {
              var fileExt = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase();
              if (acceptExts.indexOf(fileExt) < 0) {
                invalidExtension = true;
              }
            }
          }

          if (invalidExtension) {
            fileUpload.status = 'error';
            fileUpload.message = 'Invalid_file_extension';
          }

          var uploadStatus = _this8.createUploadStatus(fileUpload);
          _this8.uploadStatusList.appendChild(uploadStatus);

          if (invalidExtension) {
            return;
          }

          if (fileService) {
            fileService.uploadFile(_this8.component.storage, file, fileName, dir, function (evt) {
              fileUpload.status = 'progress';
              fileUpload.progress = parseInt(100.0 * evt.loaded / evt.total);
              delete fileUpload.message;
              var originalStatus = uploadStatus;
              uploadStatus = _this8.createUploadStatus(fileUpload);
              _this8.uploadStatusList.replaceChild(uploadStatus, originalStatus);
            }, _this8.component.url).then(function (fileInfo) {
              _this8.uploadStatusList.removeChild(uploadStatus);
              _this8.data[_this8.component.key].push(fileInfo);
              _this8.refreshDOM();
              _this8.triggerChange();
              _this8.emit('fileUpload', fileInfo.data);
            }).catch(function (response) {
              fileUpload.status = 'error';
              fileUpload.message = response;
              delete fileUpload.progress;
              var originalStatus = uploadStatus;
              uploadStatus = _this8.createUploadStatus(fileUpload);
              _this8.uploadStatusList.replaceChild(uploadStatus, originalStatus);
            });
          }
        });
      }
    }
  }, {
    key: 'getFile',
    value: function getFile(fileInfo, event) {
      var fileService = this.fileService;
      if (!fileService) {
        return alert('File Service not provided');
      }
      fileService.downloadFile(fileInfo).then(function (file) {
        if (file) {
          window.open(file.url, '_blank');
        }
      }).catch(function (response) {
        // Is alert the best way to do this?
        // User is expecting an immediate notification due to attempting to download a file.
        alert(response);
      });
      event.preventDefault();
    }
  }, {
    key: 'fileService',
    get: function get() {
      return this.options.fileService || this.options.formio;
    }
  }]);

  return FileComponent;
}(_Base.BaseComponent);