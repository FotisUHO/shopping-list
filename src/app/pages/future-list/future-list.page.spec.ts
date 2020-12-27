import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FutureListPage } from './future-list.page';

describe('FutureListPage', () => {
  let component: FutureListPage;
  let fixture: ComponentFixture<FutureListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FutureListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FutureListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
