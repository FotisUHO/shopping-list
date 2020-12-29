import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import {Shopping_List} from './Shopping_List';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  shoppingLists = new BehaviorSubject([]);

  constructor(private plt: Platform, private sqlitePorter: SQLitePorter, private sqlite: SQLite, private http: HttpClient) {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'shopping_list.db',
        location: 'default'
      })
          .then((db: SQLiteObject) => {
            this.database = db;
            this.initDatabase();
          });
    });
  }

  initDatabase() {
    this.http.get('assets/sqlite3/table_creation.sql', { responseType: 'text'})
        .subscribe(sql => {
          this.sqlitePorter.importSqlToDb(this.database, sql)
              .then(_ => {
                  this.loadLists();
                  console.log('***** Debug - Init Database');
                  this.dbReady.next(true);
              })
              .catch(e => console.error(e));
        });
  }

  getDatabaseState()
  {
      return this.dbReady.asObservable();
  }

  getLists(): Observable<any[]>
  {
      return this.shoppingLists.asObservable();
  }

  addList(listname: string)
  {
      const data = [listname];
      this.database.executeSql('INSERT INTO lists (list_name) VALUES (?)', data).then(sqlAnswer => {
          console.log('***** Debug - Adding Shopping List : ' + listname);
          this.loadLists();
      });
  }

  loadLists()
  {
      return this.database.executeSql('SELECT * from lists', []).then(data =>
      {
          if (!data.empty)
          {
              const lists = [];
              for (let i = 0; i < data.rows.length; i++)
              {
                  lists.push(
                      {
                          id: data.rows.item(i).list_id,
                          name: data.rows.item(i).list_name,
                          created: data.rows.item(i).time_created,
                          due: data.rows.item(i).time_due,
                          type: data.rows.item(i).type_id,
                          list_size: 0
                      });
              }
              this.shoppingLists.next(lists);
          }
      }).catch(e => {
          console.log('***** Debug - Error : ');
          console.error(e);
      });
  }
}


