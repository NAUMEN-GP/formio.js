import { BaseComponent } from '../base/Base';
export class TextFieldComponent extends BaseComponent {
  elementInfo() {
    let info = super.elementInfo();
    info.type = 'input';
    info.attr.type = 'text';
    info.changeEvent = 'input';
    return info;
  }

  createHint(container){
    if(!(this.component.validate && this.component.validate.maxLength)) {
        return;
    }

    let leftCharsHint = this.ce('div', {class: 'edit-hint'});
    let beforeWord = this.ce('span', {class: 'before-word'});
    leftCharsHint.appendChild(beforeWord);
    let leftCharacters = this.ce('span', {class: 'left-characters'});
    leftCharsHint.appendChild(leftCharacters);
    let afterWord = this.ce('span', {class: 'after-word'});
    leftCharsHint.appendChild(afterWord);

    let limit = this.component.validate.maxLength;
    let me = this;

    let beforeWords = ['left1', 'left2', 'left3'];
    let afterWords = ['char1', 'char2', 'char3'];


    function updateCountInfo(){
      let value;
      if(me.component.wysiwyg){
          value = me.htmlToPlainText(me.getValue());
      }else{
          value = me.getValue();
      }
      let length = value ? value.length : 0;
      let left = limit - length;
      leftCharacters.innerHTML = left.toString();
      beforeWord.innerHTML = me.t(me.decOfNum(Math.abs(left), beforeWords)) + '&nbsp;';
      afterWord.innerHTML = '&nbsp;' + me.t(me.decOfNum(Math.abs(left), afterWords));

      let containsColorRed = leftCharacters.classList.contains('color-red');
      if(length > limit){
        if(!containsColorRed){
            me.addClass(leftCharacters, 'color-red');
        }
      } else if(containsColorRed){
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
}
