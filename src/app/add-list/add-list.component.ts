import { Component, OnInit } from '@angular/core';
import { AlertController} from '@ionic/angular';
import {DatabaseService} from '../services/database.service';

@Component({
  selector: 'app-add-list',
  templateUrl: './add-list.component.html',
  styleUrls: ['./add-list.component.scss'],
})
export class AddListComponent implements OnInit {

  constructor(private alertCtrl: AlertController,
              private storage: DatabaseService) { }

  ngOnInit() {}

  async createListAlert()
  {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Add List',
      message: '<strong>Please add a list</strong>.',
      inputs: [
          {
            name: 'Name',
            placeholder: 'Name'
          }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: data => {
            if ( data.Name.length > 0)
            {
              this.createList(data.Name);
              console.log('**** ' + data.Name);
              console.log('Confirm Okay');
            }
            console.log('Empty List name');
          }
        }
      ]
    });

    await alert.present();
  }

  createList(listname: string)
  {
    this.storage.addList(listname);
  }

}
