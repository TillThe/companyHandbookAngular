import {Injectable} from "@angular/core";

@Injectable()
export class AppFunctions {
  forEachKey(callback: any): void {
    for (var i = 0; i < localStorage.length; i++) {
      callback(localStorage.key(i));
    }
  }
  toggleModal(): void {
    event.preventDefault();
    document.getElementById('modal').classList.toggle('active');
  }
  clearModalForm(): void {
    document.getElementById('modal').querySelector('form').reset();
  }
  checkForm(form: any): any {
    var inpts = form.querySelectorAll('.form-el'),
      obj = {},
      error = false;

    [].forEach.call(inpts, function(input: any) {
      if (input.value.trim().length == 0) {
        error = true;
        return;
      }
      obj[input.name] = input.value;
    });

    if (error) {
      return false;
    } else {
      return obj;
    }
  }
  addHandlers(): void {
    // [].forEach.call(document.querySelectorAll('.delete'), function(item: any) {
    //   item.setAttribute('(click)', function () {
    //     var str = item.parentNode.parentNode.getAttribute('value');
    //     // deleteItem(str);
    //     alert('kek');
    //   });
    // });
    alert('app.f');
    // [].forEach.call(document.querySelectorAll('.edit'), function(item: any) {
    //   item.onclick = function() {
    //     .editItem(item);
    //   }
    // });

    // [].forEach.call(document.querySelectorAll('.sort'), function(item: any) {
    //   item.onclick = function() {
    //     // catList.sortList(item);
    //   }
    // });
  }
  toggleEditing(els: any): void {
    for (let i = 0; i < els.length; i++) {
      if (els[i].hasAttribute('contenteditable')) {
        els[i].removeAttribute('contenteditable');
      } else {
        els[i].setAttribute('contenteditable', 'true');
      }
      els[i].classList.toggle('editing');
    }
  }

}
