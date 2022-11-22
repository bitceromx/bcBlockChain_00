import { TestBed } from '@angular/core/testing';

import { VideoIdService } from './video-id.service';

describe('VideoIdService', () => {
  let service: VideoIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoIdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
