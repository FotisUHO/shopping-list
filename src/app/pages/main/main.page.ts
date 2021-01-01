import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {Observable} from 'rxjs';

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

  shoppingListCollection: Observable<any[]>;

  constructor(private db: DatabaseService) {
    this.DateObject = new Date();
    this.dayOfWeek = this.getDayOfWeek( this.DateObject.getDay() );
    this.dateToday = this.DateObject.getDate().toString();
    this.currentMonth = this.getMonth(this.DateObject.getMonth());
  }

  ngOnInit() {
    this.db.getDatabaseState().subscribe( rdyMessage => {
      if (rdyMessage)
      {
        this.shoppingListCollection = this.db.getLists();
      }
    });
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

}
