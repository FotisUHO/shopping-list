import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {SQLitePorter} from '@ionic-native/sqlite-porter/ngx';
import {HttpClient} from '@angular/common/http';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import {Platform} from '@ionic/angular';
import ShoppingList, {FutureTime} from './Shopping_List';
import ItemOfList from './ItemOfList';
import SuggestedWord from './SuggestedWord';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  shoppingLists = new BehaviorSubject([]);
  shoppingListsNextWeek = new BehaviorSubject([]);
  shoppingListsNextMonth = new BehaviorSubject([]);
  shoppingListsNextDays = new BehaviorSubject([]);
  specificShoppingList = new BehaviorSubject([]);
  itemsOFList = new BehaviorSubject([]);
  suggestedItemsOFList = new BehaviorSubject([]);

  DateObject: Date;
  FutureTimeType: FutureTime;

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
                  this.loadFutureLists();
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

  getItemsForList(listId: number): Observable<any[]>
  {
      this.loadListItems(listId);
      return this.itemsOFList.asObservable();
  }

  getSpecificList(listId): Promise<ShoppingList>
  {
      // @ts-ignore
      return this.database.executeSql('SELECT * FROM lists WHERE list_id = ?', [listId]).then(data => {
          return{
              id: data.rows.item(0).list_id,
              name: data.rows.item(0).list_name,
              created: data.rows.item(0).time_created,
              due: data.rows.item(0).time_due,
              type: data.rows.item(0).type_id,
              listSize: 0
          };
      });
  }

  addList(listname: string)
  {
      const data = [listname];
      this.database.executeSql('INSERT INTO lists (list_name) VALUES (?)', data).then(sqlAnswer => {
          console.log('***** Debug - Adding Shopping List : ' + listname);
          this.loadLists();
          this.loadFutureLists();
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

    addItem(itemName: string, listId: number)
    {
        console.log(' **** Service is adding item.');
        const data = [itemName];
        let itemId: any[] = [];
        return this.database.executeSql('INSERT INTO items(item_name) VALUES (?)', data).then( res => {
            this.database.executeSql('SELECT item_id FROM items WHERE item_name LIKE ?', data).then( res2 => {
                if (!res2.empty)
                {
                    itemId = res2.rows.item(0).item_id;
                }
                const dataForList = [itemName, itemId, listId];
                // tslint:disable-next-line:max-line-length
                return this.database.executeSql('INSERT INTO list_items(item_name, item_id, list_id) VALUES (?, ?, ?)', dataForList).then( res3 => {
                    this.loadListItems(listId);
                }).catch( e => {
                    console.log(' ERROR : Unable to add list item.');
                    console.error(e);
                });
            }).catch( e => {
                console.log(' ERROR : Unable to find item_id.');
                console.error(e);
            });
        }).catch( e => {
            console.log(' ERROR : Unable to add item');
            console.error(e);
        });
    }

    private loadListItems(listId: number)
    {
        const data = [listId];
        return this.database.executeSql('SELECT * FROM list_items WHERE list_id = ?', data ).then( res => {
            const items: ItemOfList[] = [];
            if ( res.rows.length > 0)
            {
                for (let i = 0; i < res.rows.length; i++)
                {
                    items.push(
                        {
                            id: res.rows.item(i).list_item_id,
                            name: res.rows.item(i).item_name,
                            state: res.rows.item(i).state,
                            itemId: res.rows.item(i).item_id,
                            listId: res.rows.item(i).list_id
                        });
                }
            }
            this.itemsOFList.next(items);
        }).catch( e => {
            console.log(' ERROR : Unable to find a collection of items for this list.');
            console.error(e);
        });
    }

    updateDueDate(dueDate: string, listId: number)
    {
        const sqliteDate: string[] = dueDate.split('T');
        const sqliteDatetime = sqliteDate[0] + (' 23:59:59');
        const data = [sqliteDatetime, listId];
        console.log(' Update timestamp : ' + data[0]);
        this.database.executeSql('UPDATE lists SET time_due = ? WHERE list_id IS ?', data).then( res =>
        {
            this.loadLists();
            this.loadFutureLists();
        }).catch( e => {
            console.log(' ERROR : Unable to update date time Due.');
            console.error(e);
        });
    }

    getSuggestedWords(word: string)
    {
        this.fetchSimilarWords(word);
        return this.suggestedItemsOFList.asObservable();
    }

    fetchSimilarWords(word: string)
    {
        // TO-DO , sqlite doesnt init a regex() by default. Nee to try create this and use it here to return a smarter set of items.
        // const regEx = String('/\b(\w*' + word + 'be\w*)\b/ig');
        // console.log(' **** Creating RegEx : ' + regEx );
        const regEx = String( word + '%');
        console.log(' **** Creating RegEx : ' + regEx );
        const data = [regEx];
        return this.database.executeSql('SELECT item_id, item_name FROM items WHERE item_name LIKE ?', data ).then( res => {
            const items: SuggestedWord[] = [];
            if ( res.rows.length > 0)
            {
                for (let i = 0; i < res.rows.length; i++)
                {
                    items.push(
                        {
                            itemID: res.rows.item(i).item_id,
                            itemName: res.rows.item(i).item_name,
                        });
                }
            }
            this.suggestedItemsOFList.next(items);
        }).catch( e => {
            console.log(' ERROR : Unable to find a collection of items for this list.');
            console.error(e);
        });
    }

    deleteList(listId: number)
    {
        return this.database.executeSql('DELETE from lists WHERE list_id=?', [listId]).then(_ => {
            this.loadLists();
            this.loadFutureLists();
        }).catch( e => {
            console.log(' ERROR : Unable to delete a list.');
            console.error(e);
        });
    }

    getListsPerDate(startTimestamp: string, endTimestamp: string, typeOfFutureList: FutureTime )
    {
        const dates = [startTimestamp, endTimestamp];
        const ids = [1, 3];
        return this.database.executeSql('SELECT * from lists WHERE time_due BETWEEN ? AND ?', [dates.toString()]).then(res =>
        // return this.database.executeSql('SELECT * from lists WHERE time_due BETWEEN ? AND ? ', [dates]).then(res =>
        {
            if (!res.empty)
            {
                const lists = [];
                for (let i = 0; i < res.rows.length; i++)
                {
                    lists.push(
                        {
                            id: res.rows.item(i).list_id,
                            name: res.rows.item(i).list_name,
                            created: res.rows.item(i).time_created,
                            due: res.rows.item(i).time_due,
                            type: res.rows.item(i).type_id,
                            list_size: 0
                        });
                    console.log('**** : Retrieve list  : ' + res.rows.item(i).list_name);
                }
                switch (typeOfFutureList)
                {
                    case FutureTime.NextDays:
                        this.shoppingListsNextDays.next(lists);
                        break;
                    case FutureTime.NextMonth:
                        this.shoppingListsNextMonth.next(lists);
                        break;
                    case FutureTime.NextWeek:
                        this.shoppingListsNextWeek.next(lists);
                        break;
                    default:
                        console.log('Error: Unknown type of future list.');
                        break;
                }
            }
        }).catch(e => {
            console.log('ERROR : Unable to read future lists from database : ');
            console.error(e);
        });
    }

    updateItemState(value: number, itemID: number)
    {
        const data = [value, itemID];
        console.log(' Update item state : ' + data[0] + ' - ' + data[1]);
        this.database.executeSql('UPDATE list_items SET state = ? WHERE list_item_id IS ?', data).then( res =>
        {
            this.loadLists();
            this.loadFutureLists();
        }).catch( e => {
            console.log(' ERROR : Unable to update date time Due.');
            console.error(e);
        });
    }

    private loadFutureLists()
    {
        this.DateObject = new Date();
        const currentDate = new Date();
        const currentDateEnd = new Date().setDate(new Date().getDate() + 6);
        const nextWeekDate = new Date().setDate(new Date().getDate() + 7);
        const nextWeekDateEnd = new Date().setDate(new Date().getDate() + 14);
        const nextMonthDate = new Date().setDate(new Date().getDate() + 15);
        const nextMonthDateEnd = new Date().setDate(new Date().getDate() + 120);
        this.getListsPerDate(currentDate.toString(), currentDateEnd.toString(), FutureTime.NextDays);
        this.getListsPerDate(nextWeekDate.toString(), nextWeekDateEnd.toString(), FutureTime.NextWeek);
        this.getListsPerDate(nextMonthDate.toString(), nextMonthDateEnd.toString(), FutureTime.NextMonth);
    }

    getNextDaysList(): Observable<any[]>
    {
        return this.shoppingListsNextDays.asObservable();
    }

    getNextWeekList(): Observable<any[]>
    {
        return this.shoppingListsNextWeek.asObservable();
    }

    getNextMonthList(): Observable<any[]>
    {
        return this.shoppingListsNextMonth.asObservable();
    }
}

