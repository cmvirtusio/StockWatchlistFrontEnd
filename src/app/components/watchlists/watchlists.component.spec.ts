import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchlistsComponent } from './watchlists.component';

describe('WatchlistsComponent', () => {
  let component: WatchlistsComponent;
  let fixture: ComponentFixture<WatchlistsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WatchlistsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchlistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
