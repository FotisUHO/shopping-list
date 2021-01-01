import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {ShoppingList} from '../../services/Shopping_List';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.page.html',
  styleUrls: ['./list-view.page.scss'],
})
export class ListViewPage implements OnInit {

  listName: string;
  ShoppingListString: string[];
  theShoppingList: Promise<ShoppingList>;
  shoppingList: ShoppingList;

  // tslint:disable-next-line:no-shadowed-variable
  constructor(private route: ActivatedRoute, private db: DatabaseService, private router: Router)
  {
  }

  ngOnInit()
  {
    this.route.paramMap.subscribe(params => {
      const listId = params.get('id');
      this.db.getSpecificList(listId).then( data => {
        this.shoppingList = data;
        console.log('**** List name : ' + this.shoppingList.name);
      });
    });
  }

  // getList(id: number)
  // {
  //   console.log('**** List page Init');
  //   this.db.getDatabaseState().subscribe( rdyMessage => {
  //     if (rdyMessage)
  //     {
  //       console.log('**** List page read');
  //       this.theShoppingList = this.db.getListsId(1);
  //     }
  //   });
  // }

}
