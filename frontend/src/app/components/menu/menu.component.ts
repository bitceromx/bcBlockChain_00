import { Component, OnInit, ElementRef } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  currentRoute:String;
  collapsed: boolean = false;
  showSideNav:boolean = false;

  constructor(private router: Router, private element: ElementRef ) { 
    this.currentRoute = this.router.url;
  }

  ngOnInit(): void {
  }

  collapse() {
    if (!this.collapsed) {
      this.element.nativeElement.firstChild.classList.add('collapse');
      this.collapsed = true;
    } else {
      this.element.nativeElement.firstChild.classList.remove('collapse');
      this.collapsed = false;
    }
  }

}
