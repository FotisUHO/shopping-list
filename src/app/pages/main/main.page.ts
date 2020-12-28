import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {Shopping_List} from '../../services/Shopping_List';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  dayOfWeek: string;
  dateToday: string;
  currentMonth: string;

  DateObject: Date;

  shoppingListCollection: Shopping_List[] = [];

  constructor(private db: DatabaseService) {
    this.DateObject = new Date();
    this.dayOfWeek = this.getDayOfWeek();
    this.dateToday = this.DateObject.getDate().toString();
    this.currentMonth = this.getMonth();
  }

  ngOnInit() {
  }

  loadShoppingLists()
  {
    this.shoppingListCollection = this.db.loadLists();
    console.log(' **** Debug-Main : ' + this.shoppingListCollection[0].name);
  }

   getDayOfWeek()
   {
     switch (this.DateObject.getDay())
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

  getMonth()
  {
    switch (this.DateObject.getDay())
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

}
