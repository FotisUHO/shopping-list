import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import ShoppingList from '../../services/Shopping_List';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.page.html',
  styleUrls: ['./list-view.page.scss'],
})
export class ListViewPage implements OnInit {

  listName: string;
  ShoppingListString: string;
  theShoppingList: Promise<ShoppingList>;
  shoppingList: ShoppingList;

  listId: number;
  dateCreated: string;
  dateDue: string;
  minDate: string;
  maxDate: string;

  itemName: string;
  itemsOfList: Observable<any>;

  customPickerOptions: any;

  // tslint:disable-next-line:no-shadowed-variable
  constructor(private route: ActivatedRoute, private db: DatabaseService, private router: Router) {
    const today = new Date();
    let day = String('0' + today.getDate()).slice(-2);
    let month = String('0' + (today.getMonth())).slice(-2);
    let year = String(today.getFullYear());
    // Month is in purpose 1 not incremented to let the user use past dates for 1 month
    if (month === '00') {
      month = '12';
      year = String(today.getFullYear() - 1);
    }
    this.minDate = year + '-' + month + '-' + day;
    day = String('0' + today.getDate()).slice(-2);
    month = String('0' + (today.getMonth() + 1)).slice(-2);
    year = String(today.getFullYear() + 3);
    this.maxDate = year + '-' + month + '-' + day;
    console.log(' **** - Debug minDate = ' + this.minDate + ' maxDate = ' + this.maxDate);
  }



  ngOnInit()
  {
    this.route.paramMap.subscribe(params => {
      const listId = params.get('id');
      this.listId = +listId;
      this.db.getSpecificList(listId).then( data => {
        this.shoppingList = data;
        this.ShoppingListString = this.shoppingList.name;
        this.dateCreated = this.getPrettyTimestamp(this.shoppingList.created);
        this.dateDue = this.getPrettyTimestamp(this.shoppingList.due);
        this.listId = this.shoppingList.id;
      });
    });
    this.db.getDatabaseState().subscribe( rdyMessage => {
      if (rdyMessage)
      {
        this.itemsOfList = this.db.getItemsForList(this.listId);
      }
    });
  }

  updateDueDate(event: any)
  {
    console.log(' **** Debug - Update selected Date : ' + event.target.value);
    this.db.updateDueDate(event.target.value, this.listId);
  }

  addItem()
  {
    this.db.addItem(this.itemName, this.listId);
    this.itemName = '';
  }

  getPrettyTimestamp(sqliteΤimestamp: string)
  {
    const whitespaceChar = ' ';
    const timestamp = sqliteΤimestamp.split(' ');
    const date = timestamp[0].split('-');
    const month: number = (+date[1]) - 1;
    return (date[2] + whitespaceChar + this.getMonth((month)) + whitespaceChar + date[0]);
  }

  getDayOfWeek(date: number)
  {
    switch (date)
    {
      case 0:
        return 'Sunday';
        break;
      case 1:
        return 'Monday';
        break;
      case 2:
        return 'Tuesday';
        break;
      case 3:
        return 'Wednesday';
        break;
      case 4:
        return 'Thursday';
        break;
      case 5:
        return 'Friday';
        break;
      case 6:
        return 'Saturday';
        break;
      default:
        return 'Unkown day';
        console.log('Unknown day given by Date lbr');
        break;
    }
  }

  getMonth(month: number)
  {
    switch (month)
    {
      case 0:
        return 'January';
        break;
      case 1:
        return 'February';
        break;
      case 2:
        return 'March';
        break;
      case 3:
        return 'April';
        break;
      case 4:
        return 'May';
        break;
      case 5:
        return 'June';
        break;
      case 6:
        return 'July';
        break;
      case 7:
        return 'August';
        break;
      case 8:
        return 'September';
        break;
      case 9:
        return 'October';
        break;
      case 10:
        return 'November';
        break;
      case 11:
        return 'December';
        break;
    }
  }
  // getList(id: number)
  // {
  //   this.route.paramMap.subscribe(params => {
  //     const listId = params.get('id');
  //     this.db.getSpecificList(listId).then( data => {
  //       this.shoppingList = data;
  //       // this.ShoppingListString = this.shoppingList.name;
  //       console.log('**** List name : ' + this.shoppingList.name);
  //     });
  //   });
  // }

}
