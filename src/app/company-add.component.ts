import { Component } from '@angular/core';
import {AppFunctions} from "./app.functions";
import {CompanyListComponent} from "./company-list.component";

@Component({
  selector: 'company-add',
  templateUrl: './company-add.component.html',
})
export class CompanyAddComponent  {
  constructor(
    private appFunctions: AppFunctions,
    private list: CompanyListComponent
  ) { }

  toggleModal(): void {
    event.preventDefault();
    document.getElementById('modal').classList.toggle('active');
  }

  clearModalForm(): void {
    document.getElementById('modal').querySelector('form').reset();
  }
  test(form: any): void {
    event.preventDefault();
    console.log("Keks: ", form, form.target);
    alert('ke');
  }
  addItem(ev: any): void {
    // event.preventDefault();
    event.preventDefault();
    alert('kekooon');
    // console.log('name: ' + name.value + "\ninn: " + inn.value + "\ndirector: " + form);
    console.log("Keks: ", ev.target);
    var formObj = this.appFunctions.checkForm(ev.target),
      dataObj = {};
    if (formObj) {
      try {
        dataObj = this.list.getData();
      } catch(e) {

      }
      dataObj[formObj['INN']] = formObj;
      localStorage.setItem('data', JSON.stringify(dataObj));
      this.appFunctions.toggleModal();
      this.appFunctions.clearModalForm();
      this.list.refreshList();
    }
  }
}
