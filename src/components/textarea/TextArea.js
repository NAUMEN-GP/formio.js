import { TextFieldComponent } from '../textfield/TextField';
import { BaseComponent } from '../base/Base';
export class TextAreaComponent extends TextFieldComponent {
  wysiwygDefault() {
    return {
      toolbarGroups:  [
        {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
        {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']},
        {name: 'links', groups: ['links']},
        {name: 'insert', groups: ['insert']},
        '/',
        {name: 'styles', groups: ['Styles', 'Format', 'Font', 'FontSize']},
        {name: 'colors', groups: ['colors']},
        {name: 'clipboard', groups: ['clipboard', 'undo']},
        {name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing']},
        {name: 'document', groups: ['mode', 'document', 'doctools']},
        {name: 'others', groups: ['others']},
        {name: 'tools', groups: ['tools']}
      ],
      extraPlugins: 'justify,font',
      removeButtons: 'Cut,Copy,Paste,Underline,Subscript,Superscript,Scayt,About',
      uiColor: '#eeeeee',
      height: '400px',
      width: '100%'
    };
  }

  createInput(container) {
    var t = this;
    if (!this.component.wysiwyg) {
      return super.createInput(container);
    }

    if (typeof this.component.wysiwyg === 'boolean') {
      this.component.wysiwyg = this.wysiwygDefault();
    }

    // Add the input.
    this.input = this.ce('textarea', {
      class: 'form-control'
    });
    container.appendChild(this.input);

    var originalChange = function(e) { };
    var settings = this.component.wysiwyg;

    if(settings.on && settings.on.change && typeof settings.on.change == "function") {
      originalChange = settings.on.change;
    }

    if(!settings.on) { settings.on = {}; }

    settings.on.change = function (e) {
      t.updateValue(true);
      originalChange(e);
    }

    if (this.options.readOnly || this.component.disabled) {
      settings.readOnly = true;
    }

    this.ckEditorInstance = CKEDITOR.replace(this.input, settings);

    return this.input;
  }

  setValue(value, flags) {
    if (!this.component.wysiwyg) {
      return super.setValue(value, flags);
    }
    this.ckEditorInstance.setData(value);
    this.updateValue(flags);
  }

  getValue() {
    if (!this.component.wysiwyg) {
      return super.getValue();
    }

    if (this.ckEditorInstance) {
      return this.ckEditorInstance.getData();
    }
  }

  elementInfo() {
    let info = super.elementInfo();
    info.type = 'textarea';
    if (this.component.rows) {
      info.attr.rows = this.component.rows;
    }
    return info;
  }

  destroy(){
      if(this.ckEditorInstance){
          CKEDITOR.remove(this.ckEditorInstance);
      }
  }
}
