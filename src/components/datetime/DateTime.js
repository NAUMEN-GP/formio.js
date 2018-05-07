import { BaseComponent } from '../base/Base';
import Flatpickr from 'flatpickr';
import _get from 'lodash/get';
import _each from 'lodash/each';

import Russian from "flatpickr/dist/l10n/ru";
import _isArray from "lodash/isArray";

const momentModule = require('moment');

export class DateTimeComponent extends BaseComponent {
  constructor(component, options, data) {
    super(component, options, data);
    this.validators.push('date');
  }

  elementInfo() {
    let info = super.elementInfo();
    info.type = 'input';
    info.attr.type = 'text';
    info.changeEvent = 'input';
    this.component.suffix = true;
    return info;
  }

  build() {
    super.build();

    // See if a default date is set.
    if (this.component.defaultDate) {
      var defaultDate = new Date(this.component.defaultDate);
      if (!defaultDate || isNaN(defaultDate.getDate())) {
        try {
          let moment = momentModule;
          defaultDate = new Date(eval(this.component.defaultDate));
        }
        catch (e) {
          defaultDate = '';
        }
      }

      if (defaultDate && !isNaN(defaultDate.getDate())) {
        this.setValue(defaultDate);
      }
    }
  }

  // This select component can handle multiple items on its own.
  createWrapper() {
    return false;
  }

  convertFormat(format) {
    // Year conversion.
    format = format.replace(/y/g, 'Y');
    format = format.replace('YYYY', 'Y');
    format = format.replace('YY', 'y');

    // Month conversion.
    format = format.replace('MMMM', 'F');
    format = format.replace(/M/g, 'n');
    format = format.replace('nnn', 'M');
    format = format.replace('nn', 'm');

    // Day in month.
    format = format.replace(/d/g, 'j');
    format = format.replace('jj', 'd');

    // Day in week.
    format = format.replace('EEEE', 'l');
    format = format.replace('EEE', 'D');

    // Hours, minutes, seconds
    format = format.replace('HH', 'H');
    format = format.replace('hh', 'h');
    format = format.replace('mm', 'i');
    format = format.replace('ss', 'S');
    format = format.replace(/a/g, 'K');
    return format;
  }

  get config() {
    return {
      altInput: true,
      clickOpens: true,
      enableDate: true,
      mode: this.component.multiple ? 'multiple' : 'single',
      enableTime: _get(this.component, 'enableTime', true),
      noCalendar: !_get(this.component, 'enableDate', true),
      altFormat: this.convertFormat(_get(this.component, 'format', '')),
      dateFormat: 'U',
      defaultDate: _get(this.component, 'defaultDate', ''),
      hourIncrement: _get(this.component, 'timePicker.hourStep', 1),
      minuteIncrement: _get(this.component, 'timePicker.minuteStep', 5),
      time_24hr: !_get(this.component, 'timePicker.showMeridian', false) ,
      locale: Russian.ru,
      onChange: () => this.onChange()
    };
  }

  set disabled(disabled) {
    super.disabled = disabled;
    _each(this.inputs, (input) => {
      if (input.calendar) {
        input.calendar.redraw();
      }
    });
  }

  addSuffix(input, inputGroup) {
    let suffix = this.ce('span', {
      class: 'input-group-addon'
    });
    suffix.appendChild(this.getIcon(this.component.enableDate ? 'calendar' : 'time'));
    inputGroup.appendChild(suffix);
    return suffix;
  }

  addInput(input, container, name) {
    super.addInput(input, container, name);
    input.calendar = new Flatpickr(input, this.config);
  }

  getDate(value) {
    let timestamp = parseInt(value, 10);
    if (!timestamp) {
      return null;
    }else{
      return (new Date(timestamp * 1000));
    }
  }

  localMillisecondsToUTCMilliseconds(localMs){
    let localOffsetMs = (new Date()).getTimezoneOffset() * 60000;
    return localMs + localOffsetMs;
  }

  UTCMillisecondsToLocalMilliseconds(utcMs){
    let localOffsetMs = (new Date()).getTimezoneOffset() * 60000;
    return utcMs - localOffsetMs;
  }

  getRawValue() {
    let values = [];
    for (let i in this.inputs) {
      if (!this.component.multiple) {
        let secondsValue = this.inputs[i].value;
        return this.localMillisecondsToUTCMilliseconds(secondsValue * 1000);
      }
      let secondsValue = this.inputs[i].value;
      values.push(this.localMillisecondsToUTCMilliseconds(secondsValue * 1000));
    }
    return values;
  }

  getValueAt(index) {
    var secondsValue = this.inputs[index].value;
    if(secondsValue){
      if(this.disabled) {
          return secondsValue * 1000;
      } else {
          return this.localMillisecondsToUTCMilliseconds(secondsValue * 1000);
      }
    }else{
        return null;
    }
  }

  setValueAt(index, value) {
    if (this.inputs[index].calendar && value) {
      this.inputs[index].calendar.setDate((new Date(this.UTCMillisecondsToLocalMilliseconds(value))));
    }
  }

  getLocalRawValue() {
    let values = [];
    for (let i in this.inputs) {
      if (!this.component.multiple) {
        return this.inputs[i].value;
      }
      values.push(this.inputs[i].value);
    }
    return values;
  }

  asString(defValue) {
    let value = defValue || this.getLocalRawValue();
    return _isArray(value) ? value.join(', ') : value.toString();
  }
}
