import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListViewPage } from './list-view.page';

describe('ListViewPage', () => {
  let component: ListViewPage;
  let fixture: ComponentFixture<ListViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
