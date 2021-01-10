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

  shoppingListCollectionNextDays: Observable<any[]>;
  shoppingListCollectionNextWeek: Observable<any[]>;
  shoppingListCollectionNextMonths: Observable<any[]>;

  constructor(private db: DatabaseService)
  {

  }

  ngOnInit() {
    this.db.getDatabaseState().subscribe( rdyMessage => {
      if (rdyMessage)
      {
        this.shoppingListCollectionNextDays = this.db.getNextDaysList();
        this.shoppingListCollectionNextWeek = this.db.getNextWeekList();
        this.shoppingListCollectionNextMonths = this.db.getNextMonthList();
      }
    });
  }
}
