import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsOrg1Component } from './assets-org1.component';

describe('AssetsOrg1Component', () => {
  let component: AssetsOrg1Component;
  let fixture: ComponentFixture<AssetsOrg1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsOrg1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsOrg1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
