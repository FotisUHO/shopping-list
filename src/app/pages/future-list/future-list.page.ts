import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {DatabaseService} from '../../services/database.service';
import {timestamp} from 'rxjs/operators';
import {strict} from 'assert';

@Component({
  selector: 'app-future-list',
  templateUrl: './future-list.page.html',
  styleUrls: ['./future-list.page.scss'],
})
export class FutureListPage implements OnInit {

  DateObject: Date;

  shoppingListCollectionNextDays: Observable<any[]>;
  shoppingListCollectionNextWeek: Observable<any[]>;
  shoppingListCollectionNextMonths: Observable<any[]>;

  constructor(private db: DatabaseService)
  {
    this.DateObject = new Date();
  }

  ngOnInit() {
    this.db.getDatabaseState().subscribe( rdyMessage => {
      if (rdyMessage)
      {
        // this.shoppingListCollectionNextDays = this.db.getListsPerDate();
        // this.shoppingListCollectionNextWeek = this.db.getListsPerDate( );
        // this.shoppingListCollectionNextMonths = this.db.getListsPerDate(startTimestamp: string, endTimestamp: string );
      }
    });
  }

  getPrettyTimestamp(sqliteΤimestamp: string)
  {
    // const whitespaceChar = ' ';
    // const timestamp = sqliteΤimestamp.split(' ');
    // const date = timestamp[0].split('-');
    // const month: number = (+date[1]) - 1;
    // return (date[2] + whitespaceChar + this.getMonth((month)) + whitespaceChar + date[0]);
  }

}
