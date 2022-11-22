import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VideoIdService } from '../services/video-id.service';

@Component({
  selector: 'app-video-id',
  templateUrl: './video-id.component.html',
  styleUrls: ['./video-id.component.scss']
})
export class VideoIdComponent implements OnInit, AfterViewInit {

  authorization: string;
  video: boolean = true;
  errorTitle: string;
  errorDescription: string;

  constructor(private router: Router,
              private vIdService: VideoIdService) {
    // this.loadScript();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.vIdService.authorization().then(response => {
      this.authorization = response.authorization;

      let videoId = window['EID'].videoId('#video', {
        lang: "en"
      });

      videoId.turnOn();

      videoId.start({
       authorization: this.authorization,
       idType: 189
      });

      videoId.on("completed",(video) => {
          videoId.turnOff();
          this.vIdService.getInfo(video.id).then(response => {
            localStorage.setItem('info', JSON.stringify(response));
            console.log(localStorage.getItem('info'));
            this.router.navigateByUrl('onboarding/documentation/video-info');
          }, error => {
            console.log(error)
          })
      });

      videoId.on("failed", (error) => {
        console.log(error);
      });

    }, error => {
      this.errorTitle = error.error;
      this.errorDescription = error.error_description
    })

  }

  loadScript() {
    const node = document.createElement('script');
    node.src= 'https://etrust-sandbox.electronicid.eu/v2/js/videoid.js';
    node.type = 'text/javascript';
    node.async = true;
    document.getElementsByTagName('head')[0].appendChild(node);
  }

}
