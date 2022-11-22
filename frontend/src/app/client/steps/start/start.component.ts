import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  @Output() exist = new EventEmitter;

  form: FormGroup;
  next: string;
  resp: boolean;
  mail: string;

  constructor(private formBuilder: FormBuilder,
              private apiService: ApiService,
              private router: Router) {
    this.buildForm();
  }

  ngOnInit(): void {
    localStorage.clear();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      electorKey: ['', [Validators.required]],
    })
  }

  save(event: Event) {
    
    this.apiService.post('http://127.0.0.1:5000/blockchain/network', {'up': 1}).then(resp=>{
    });
    
    
  }
}
