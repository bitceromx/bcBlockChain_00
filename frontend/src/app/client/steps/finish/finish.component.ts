import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.scss']
})
export class FinishComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    localStorage.clear();
  }

}
