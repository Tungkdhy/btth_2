import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagerListComponent } from './user-manager-list.component';

describe('UserManagerListComponent', () => {
  let component: UserManagerListComponent;
  let fixture: ComponentFixture<UserManagerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UserManagerListComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(UserManagerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
