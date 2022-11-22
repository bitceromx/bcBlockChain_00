import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoIdComponent } from './video-id.component';

describe('VideoIdComponent', () => {
  let component: VideoIdComponent;
  let fixture: ComponentFixture<VideoIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
