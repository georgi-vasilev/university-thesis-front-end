import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HostEventsComponent } from './events.component';


describe('EventsComponent', () => {
  let component: HostEventsComponent;
  let fixture: ComponentFixture<HostEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
