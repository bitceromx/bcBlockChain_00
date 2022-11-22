import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { element } from 'protractor';

import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit, AfterViewInit {

  options: any;
  path: string;
  client: string;

  constructor(private element: ElementRef, private apiService:ApiService) {}

  ngOnInit(): void {
    this.client = localStorage.getItem('existClient');
    if (this.client === 'exist') {
      this.options = [
        { name: 'Inicio' , url: '/onboarding/documentation/start'},
        { name: 'Protege tu cuenta', url: '/onboarding/documentation/otp'},
        { name: 'Información', url: '/onboarding/documentation/data'},
        { name: 'Finalizar', url: '/onboarding/documentation/finish'}
      ]
    } else {
      this.options = [
        { name: 'Inicio' , url: '/onboarding/documentation/start'},
        { name: 'Información', url: '/onboarding/documentation/data'},
        { name: 'Protege tu cuenta', url: '/onboarding/documentation/account'},
        { name: 'Finalizar', url: '/onboarding/documentation/finish'}
      ]
    }

    this.path = document.location.pathname;
  }

  ngAfterViewInit() {
    const element = this.element.nativeElement.getElementsByClassName('current')[0];
    const prevSiblings = this.getPreviousSiblings(element);
    this.changeClasses(prevSiblings);
  }

  getPreviousSiblings(e) {
    const siblings = [];
    if (!e.parentNode) {
        return siblings;
    }
    let sibling  = e.previousSibling;
    while (sibling) {
      siblings.push(sibling);
      sibling = sibling.previousSibling;
    }
    return siblings;
  }

  changeClasses(siblings) {
    const elements = this.element.nativeElement.getElementsByClassName('done');
    if (elements.length > 0) {
      for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove('done');
      }
    }
    if (siblings.length > 0) {
      for (let i = 0; i < siblings.length; i++) {
        siblings[i].classList.add('done');
      }
    }
  }

}
