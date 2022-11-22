import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-client-not-found',
  templateUrl: './client-not-found.component.html',
  styleUrls: ['./client-not-found.component.scss']
})
export class ClientNotFoundComponent implements OnInit {

  selected:string;

  constructor(private apiService: ApiService) {
    this.selected = 'mex'
  }

  ngOnInit(): void {}

}
