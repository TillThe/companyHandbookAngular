import {Component, OnInit} from '@angular/core';
import {AppFunctions} from './app.functions';

@Component({
  selector: 'company-list',
  templateUrl: './company-list.component.html',
})
export class CompanyListComponent implements OnInit {
  itemsOnPage: number;

  constructor(private appFunctions: AppFunctions) { }

  ngOnInit(): void {
    if (localStorage.getItem('itemsOnPage') == null) {
      localStorage.setItem('itemsOnPage', '4');
    }
    if (localStorage.getItem('currentPage') == null) {
      localStorage.setItem('currentPage', '1');
    }
    console.log(this);
    this.itemsOnPage = parseInt(localStorage.getItem('itemsOnPage'));
    this.refreshList();
    this.suggestionStart();
  }

  suggestionStart(): void {
    jQuery("#Name").suggestions({
      token: "a4673c9942e4738c8bfdfdaad192edef690df398",
      type: "PARTY",
      count: 5,
      /* Вызывается, когда пользователь выбирает одну из подсказок */
      onSelect: function(suggestion: any) {
        try {
          (<HTMLInputElement>document.getElementById('INN')).value = suggestion.data.inn;
        } catch(e) {
          (<HTMLInputElement>document.getElementById('INN')).value = "";
        }
        try {
          (<HTMLInputElement>document.getElementById('Director')).value = suggestion.data.management.name;
        } catch(e) {
          (<HTMLInputElement>document.getElementById('Director')).value = "";
        }
      }
    });
  }

  getData(): {} {
    try {
      if (localStorage.getItem('data') != null)  {
        return JSON.parse(localStorage.getItem('data'));
      } else {
        return {};
      }
    } catch(e) {
      return {};
    }
  }

  getArray(): string[] {
    var data = this.getData(),
      arr = [];
    for (var key in data) {
      arr.push(data[key]);
    }
    return arr;
  }

  arrToObj(arr:any): {} {
    var obj = {},
      i;
    for (i = 0; i < arr.length; i++) {
      obj[arr[i]['INN']] = arr[i];
    }
    return obj;
  }

  refreshList(): void {
    var data = this.getData(),
      str = "",
      itemsOnPage = parseInt(localStorage.getItem('itemsOnPage')),
      currentPage = parseInt(localStorage.getItem('currentPage')),
      i = 0;
    console.log(data);
    this.createPagination();

    for (var key in data) {
      if (i >= itemsOnPage * (currentPage-1) && i < itemsOnPage * currentPage) {
        str += "<tr value='" + data[key]['INN'] + "'><td class='editable'>" + data[key]['INN'] + "</td>"
          + "<td class='editable'>" + data[key]['Name'] + "</td>"
          + "<td class='editable'>" + data[key]['Director'] + "</td>"
          + "<td><span class='edit'>Редактировать</span></td>"
          + "<td><span class='delete'>Удалить</span></td>"
          + "</tr>";
      }
      i++;
    }
    document.getElementById('company-list').innerHTML = str;
    this.addHandlers();
  }

  countItems(): number {
    return this.getArray().length;
  }

  createPagination(): void {
    var itemsOnPage = parseInt(localStorage.getItem('itemsOnPage')),
    pageAmount = Math.ceil(this.countItems() / itemsOnPage),
    str = "",
    i;

    for (i = 1; i <= pageAmount; i++) {
    str += (parseInt(localStorage.getItem('currentPage')) == i) ? "<li class='active'><a href='#page-" + i + "'>" + i + "</a></li>" : "<li><a href='#page-" + i + "'>" + i + "</a></li>";
    }
    document.getElementById('pagination').innerHTML = str;
  }

  editItem(btn: any): void {
    var tr = btn.parentNode.parentNode,
      els = tr.querySelectorAll('.editable'),
      inn = tr.getAttribute('value'),
      i,
      data;
    if (btn.innerHTML == "Редактировать") {
      btn.innerHTML = "Сохранить";
      this.appFunctions.toggleEditing(els);
    } else {
      btn.innerHTML = "Редактировать";
      this.appFunctions.toggleEditing(els);
      data = this.getData();
      if (data[els[0].innerHTML] == undefined) {
        delete data[inn];
      }
      data[els[0].innerHTML] = {INN: els[0].innerHTML, Name: els[1].innerHTML, Director: els[2].innerHTML};
      localStorage.setItem('data', JSON.stringify(data));
      this.refreshList();
    }
  }

  deleteItem(key: any): void {
    var data = this.getData();
    delete data[key];
    localStorage.setItem('data', JSON.stringify(data));
    this.refreshList();
  }

  sortList(item: any): void {
    var data = this.getData(),
      field = item.getAttribute('value'),
      sortType = item.getAttribute('sorted'),
      reversed = item.getAttribute('reversed'),
      arr = this.getArray(),
      obj = {};

    console.log("sort type:" + sortType, "reversed:" + reversed);
    console.log(data);

    if (sortType == 'digits') {
      arr.sort(function(a, b) {
        console.log(a[field], b[field]);
        if (parseInt(a[field]) > parseInt(b[field])) {
          return 1;
        }
        if (parseInt(a[field]) < parseInt(b[field])) {
          return -1;
        }
        return 0;
      });
    } else if(sortType == "letters") {
      arr.sort(function(a, b) {
        console.log(a[field], b[field]);
        return a[field].localeCompare(b[field]);
      });
    }

    if (reversed == "true") {
      arr = arr.reverse();
      // console.log("reverse:", arr);
      item.setAttribute('reversed', false);
    } else {
      item.setAttribute('reversed', true);
    }
    // console.log('k: ', k);
    obj = this.arrToObj(arr);
    console.log(obj);
    localStorage.setItem('data', JSON.stringify(obj));
    this.refreshList();
  }

  addHandlers(): void {
    var list = this;
    [].forEach.call(document.querySelectorAll('.delete'), function(item: any) {
      item.onclick = function() {
        var str = item.parentNode.parentNode.getAttribute('value');
        list.deleteItem(str);
      }
    });
    [].forEach.call(document.querySelectorAll('.edit'), function(item: any) {
      item.onclick = function () {
        list.editItem(item);
      }
    });

    [].forEach.call(document.querySelectorAll('.sort'), function(item: any) {
      item.onclick = function() {
        list.sortList(item);
      }
    });
  }

  changeItemsOnPage(): void {
    if (this.itemsOnPage < 50 && this.itemsOnPage > 0) {
      localStorage.setItem('itemsOnPage', "" + this.itemsOnPage);
    } else {
      localStorage.setItem('itemsOnPage', "50");
    }
    this.refreshList();
  }
}
